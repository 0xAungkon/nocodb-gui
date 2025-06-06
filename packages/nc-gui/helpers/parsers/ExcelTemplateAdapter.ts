import { type ColumnType, UITypes, getDateFormat, parseProp } from 'nocodb-sdk'
import { workerWithTimezone } from '../../utils/worker/datetimeUtils'
import TemplateGenerator, { type ProgressMessageType } from './TemplateGenerator'
import {
  extractMultiOrSingleSelectProps,
  getCheckboxValue,
  isCheckboxType,
  isEmailType,
  isMultiLineTextType,
  isUrlType,
} from './parserHelpers'

const excelTypeToUidt: Record<string, UITypes> = {
  d: UITypes.DateTime,
  b: UITypes.Checkbox,
  n: UITypes.Number,
  s: UITypes.SingleLineText,
}

export default class ExcelTemplateAdapter extends TemplateGenerator {
  config: Record<string, any>

  excelData: any

  base: {
    tables: Record<string, any>[]
  }

  data: Record<string, any> = {}

  wb: any

  xlsx: typeof import('xlsx')

  existingColumnMap: Record<string, ColumnType> = {}

  constructor(
    data = {},
    parserConfig = {},
    xlsx: any = null,
    progressCallback?: (msg: ProgressMessageType) => void,
    existingColumns?: ColumnType[],
  ) {
    super(progressCallback)
    this.config = parserConfig
    this.excelData = data
    this.base = {
      tables: [],
    }
    this.xlsx = xlsx
    if (existingColumns && existingColumns.length) {
      for (const col of existingColumns) {
        this.existingColumnMap[col.title as string] = col
        this.existingColumnMap[col.column_name as string] = col
      }
    }
  }

  async init() {
    this.progress('Initializing excel parser')
    this.xlsx = this.xlsx || (await import('xlsx'))

    const options = {
      cellText: true,
      cellDates: true,
    }

    this.wb = this.xlsx.read(new Uint8Array(this.excelData), {
      type: 'array',
      ...options,
    })
  }

  async parse() {
    this.progress('Reading excel file')
    const tableNamePrefixRef: Record<string, any> = {}
    await Promise.all(
      this.wb.SheetNames.map((sheetName: string) =>
        (async (sheet) => {
          this.progress(`Reading sheet ${sheetName}`)

          await new Promise((resolve) => {
            const columnNamePrefixRef: Record<string, any> = { id: 0, Id: 0 }
            let tn: string = (sheet || 'table').replace(/[` ~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/g, '_').trim()

            while (tn in tableNamePrefixRef) {
              tn = `${tn}${++tableNamePrefixRef[tn]}`
            }
            tableNamePrefixRef[tn] = 0

            const table = { table_name: tn, ref_table_name: tn, columns: [] as any[] }
            const ws: any = this.wb.Sheets[sheet]
            const colValueResolver: Record<number, (value: any) => any> = {}

            // if sheet is empty, skip it
            if (!ws || !ws['!ref']) {
              return resolve(true)
            }

            const range = this.xlsx.utils.decode_range(ws['!ref'])
            let rows: any = this.xlsx.utils.sheet_to_json(ws, {
              // header has to be 1 disregarding this.config.firstRowAsHeaders
              // so that it generates an array of arrays
              header: 1,
              blankrows: false,
              defval: null,
            })

            // fix precision bug & timezone offset issues introduced by xlsx
            const basedate = new Date(1899, 11, 30, 0, 0, 0)
            // number of milliseconds since base date
            const dnthresh = basedate.getTime() + (new Date().getTimezoneOffset() - basedate.getTimezoneOffset()) * 60000
            // number of milliseconds in a day
            const day_ms = 24 * 60 * 60 * 1000
            // handle date1904 property
            const fixImportedDate = (date: Date) => {
              const parsed = this.xlsx.SSF.parse_date_code((date.getTime() - dnthresh) / day_ms, {
                date1904: this.wb.Workbook.WBProps.date1904,
              })
              return new Date(parsed.y, parsed.m, parsed.d, parsed.H, parsed.M, parsed.S)
            }

            if (rows[0] && rows[0].length) {
              for (let col = 0; col < rows[0].length; col++) {
                const title = (
                  (this.config.firstRowAsHeaders && rows[0] && rows[0][col] && rows[0][col].toString().trim()) ||
                  `Field ${col + 1}`
                ).trim()
                let cn: string = (
                  (this.config.firstRowAsHeaders && rows[0] && rows[0][col] && rows[0][col].toString().trim()) ||
                  `field_${col + 1}`
                )
                  .replace(/[` ~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/g, '_')
                  .trim()

                while (cn in columnNamePrefixRef) {
                  cn = `${cn}${++columnNamePrefixRef[cn]}`
                }
                columnNamePrefixRef[cn] = 0

                const column: Record<string, any> = {
                  title,
                  column_name: cn,
                  ref_column_name: cn,
                  meta: {},
                  uidt: UITypes.SingleLineText,
                }

                table.columns.push(column)

                const existingColumn = this.existingColumnMap[column.title] ?? this.existingColumnMap[column.column_name]
                if (existingColumn && (existingColumn.meta as any)?.date_format) {
                  colValueResolver[col] = (value: any) => {
                    if (value instanceof Date) {
                      return value
                    }
                    const meta = parseProp(existingColumn.meta)
                    const dateValue = workerWithTimezone(this.config.isEeUI, meta?.timezone).dayjsTz(
                      value,
                      meta.date_format && meta.time_format ? `${meta.date_format} ${meta.time_format}` : undefined,
                    )
                    return dateValue?.isValid() ? dateValue.format('YYYY-MM-DD HH:mm:ss Z') : value
                  }
                } else if (
                  existingColumn &&
                  [UITypes.Number, UITypes.Decimal, UITypes.Currency].includes(existingColumn.uidt as UITypes)
                ) {
                  colValueResolver[col] = (value: any) => {
                    return Number(value)
                  }
                }
              }
            }

            // fix imported date
            rows = rows.map((r: any) =>
              r.map((v: any, index: number) => {
                if (v instanceof Date) {
                  return fixImportedDate(v)
                }
                if (colValueResolver[index]) {
                  return colValueResolver[index](v)
                }
                return v
              }),
            )

            if (this.config.autoSelectFieldTypes) {
              for (let col = 0; col < rows[0].length; col++) {
                const column = table.columns[col]
                const cellId = this.xlsx.utils.encode_cell({
                  c: range.s.c + col,
                  r: +this.config.firstRowAsHeaders,
                })
                const cellProps = ws[cellId] || {}
                column.uidt = this.config.importDataOnly
                  ? excelTypeToUidt[cellProps.t] || UITypes.SingleLineText
                  : UITypes.SingleLineText

                if (column.uidt === UITypes.SingleLineText && this.config.importDataOnly) {
                  // check for long text
                  if (isMultiLineTextType(rows, col)) {
                    column.uidt = UITypes.LongText
                  } else if (isEmailType(rows, col)) {
                    column.uidt = UITypes.Email
                  } else if (isUrlType(rows, col)) {
                    column.uidt = UITypes.URL
                  } else {
                    const vals = rows
                      .slice(+this.config.firstRowAsHeaders)
                      .map((r: any) => r[col])
                      .filter((v: any) => v !== null && v !== undefined && v.toString().trim() !== '')

                    if (isCheckboxType(vals)) {
                      column.uidt = UITypes.Checkbox
                    } else {
                      // Single Select / Multi Select
                      Object.assign(column, extractMultiOrSingleSelectProps(vals))
                    }
                  }
                } else if (column.uidt === UITypes.Number) {
                  if (
                    rows.slice(1, this.config.maxRowsToParse).some((v: any) => {
                      return v && v[col] && parseInt(v[col]) !== +v[col]
                    })
                  ) {
                    column.uidt = UITypes.Decimal
                  }
                  if (
                    rows.slice(1, this.config.maxRowsToParse).every((v: any, i: any) => {
                      const cellId = this.xlsx.utils.encode_cell({
                        c: range.s.c + col,
                        r: i + +this.config.firstRowAsHeaders,
                      })

                      const cellObj = ws[cellId]

                      return !cellObj || (cellObj.w && cellObj.w.startsWith('$'))
                    })
                  ) {
                    column.uidt = UITypes.Currency
                  }
                  if (
                    rows.slice(1, this.config.maxRowsToParse).some((v: any, i: any) => {
                      const cellId = this.xlsx.utils.encode_cell({
                        c: range.s.c + col,
                        r: i + +this.config.firstRowAsHeaders,
                      })

                      const cellObj = ws[cellId]
                      return !cellObj || (cellObj.w && !(!isNaN(Number(cellObj.w)) && !isNaN(parseFloat(cellObj.w))))
                    })
                  ) {
                    // fallback to SingleLineText
                    column.uidt = UITypes.SingleLineText
                  }
                } else if (column.uidt === UITypes.DateTime) {
                  // TODO(import): centralise
                  // hold the possible date format found in the date
                  const dateFormat: Record<string, number> = {}
                  if (
                    rows.slice(1, this.config.maxRowsToParse).every((v: any, i: any) => {
                      const cellId = this.xlsx.utils.encode_cell({
                        c: range.s.c + col,
                        r: i + +this.config.firstRowAsHeaders,
                      })

                      const cellObj = ws[cellId]
                      const isDate = !cellObj || (cellObj.w && cellObj.w.split(' ').length === 1)
                      if (isDate && cellObj) {
                        dateFormat[getDateFormat(cellObj.w)] = (dateFormat[getDateFormat(cellObj.w)] || 0) + 1
                      }
                      return isDate
                    })
                  ) {
                    column.uidt = UITypes.Date
                    // take the date format with the max occurrence
                    column.meta.date_format =
                      Object.keys(dateFormat).reduce((x, y) => (dateFormat[x] > dateFormat[y] ? x : y)) || 'YYYY/MM/DD'
                  }
                }
              }
            }
            this.base.tables.push(table)

            this.data[tn] = []
            if (this.config.shouldImportData) {
              this.progress(`Reading data from ${tn}`)
              let rowIndex = 0
              for (const row of rows.slice(1)) {
                const rowData: Record<string, any> = {}
                for (let i = 0; i < table.columns.length; i++) {
                  if (!this.config.autoSelectFieldTypes || !this.config.importDataOnly) {
                    // take raw data instead of data parsed by xlsx
                    const cellId = this.xlsx.utils.encode_cell({
                      c: range.s.c + i,
                      r: rowIndex + +this.config.firstRowAsHeaders,
                    })
                    const cellObj = ws[cellId]
                    rowData[table.columns[i].column_name] = (cellObj && cellObj.w) || row[i]
                  } else {
                    if (table.columns[i].uidt === UITypes.Checkbox) {
                      rowData[table.columns[i].column_name] = getCheckboxValue(row[i])
                    } else if (table.columns[i].uidt === UITypes.Currency) {
                      const cellId = this.xlsx.utils.encode_cell({
                        c: range.s.c + i,
                        r: rowIndex + +this.config.firstRowAsHeaders,
                      })

                      const cellObj = ws[cellId]
                      rowData[table.columns[i].column_name] =
                        (cellObj && typeof cellObj?.w === 'string' && cellObj.w.replace(/[^\d.]+/g, '')) || row[i]
                    } else if (table.columns[i].uidt === UITypes.SingleSelect || table.columns[i].uidt === UITypes.MultiSelect) {
                      rowData[table.columns[i].column_name] = (row[i] || '').toString().trim() || null
                    } else if (table.columns[i].uidt === UITypes.Date) {
                      const cellId = this.xlsx.utils.encode_cell({
                        c: range.s.c + i,
                        r: rowIndex + +this.config.firstRowAsHeaders,
                      })
                      const cellObj = ws[cellId]
                      rowData[table.columns[i].column_name] = (cellObj && cellObj.w) || row[i]
                    } else if (table.columns[i].uidt === UITypes.SingleLineText || table.columns[i].uidt === UITypes.LongText) {
                      const rowValue = row[i]
                      rowData[table.columns[i].column_name] =
                        rowValue === null || rowValue === undefined
                          ? null
                          : typeof rowValue === 'number'
                          ? rowValue
                          : `${rowValue}`
                    } else {
                      // TODO: do parsing if necessary based on type
                      rowData[table.columns[i].column_name] = row[i]
                    }
                  }
                }
                this.data[tn].push(rowData)
                rowIndex++
              }
            }

            resolve(true)
          })
        })(sheetName),
      ),
    )
  }

  getTemplate() {
    return this.base
  }

  getData() {
    return this.data
  }

  getColumns() {
    return this.base.tables.map((t: Record<string, any>) => t.columns)
  }
}
