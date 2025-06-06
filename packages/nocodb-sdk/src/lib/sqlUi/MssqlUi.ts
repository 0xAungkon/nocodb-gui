import UITypes from '../UITypes';
import { IDType } from './index';
import { ColumnType } from '~/lib';
import { SqlUi } from './SqlUI.types';
import { numberize } from '../numberUtils';

const dbTypes = [
  'bigint',
  'binary',
  'bit',
  'char',
  'date',
  'datetime',
  'datetime2',
  'datetimeoffset',
  'decimal',
  'float',
  'geography',
  'geometry',
  'heirarchyid',
  'image',
  'int',
  'money',
  'nchar',
  'ntext',
  'numeric',
  'nvarchar',
  'real',
  'json',
  'smalldatetime',
  'smallint',
  'smallmoney',
  'sql_variant',
  'sysname',
  'text',
  'time',
  'timestamp',
  'tinyint',
  'uniqueidentifier',
  'varbinary',
  'xml',
  'varchar',
];

export class MssqlUi implements SqlUi {
  //#region statics
  static getNewTableColumns() {
    return [
      {
        column_name: 'id',
        title: 'Id',
        dt: 'int',
        dtx: 'integer',
        ct: 'int(11)',
        nrqd: false,
        rqd: true,
        ck: false,
        pk: true,
        un: false,
        ai: true,
        cdf: null,
        clen: null,
        np: null,
        ns: 0,
        dtxp: '',
        dtxs: '',
        altered: 1,
        uidt: 'ID',
        uip: '',
        uicn: '',
      },
      {
        column_name: 'title',
        title: 'Title',
        dt: 'TEXT',
        dtx: 'specificType',
        ct: null,
        nrqd: true,
        rqd: false,
        ck: false,
        pk: false,
        un: false,
        ai: false,
        cdf: null,
        clen: null,
        np: null,
        ns: null,
        dtxp: '',
        dtxs: '',
        altered: 1,
        uidt: 'SingleLineText',
        uip: '',
        uicn: '',
      },
      {
        column_name: 'created_at',
        title: 'CreatedAt',
        dt: 'datetime',
        dtx: 'specificType',
        ct: 'datetime',
        nrqd: true,
        rqd: false,
        ck: false,
        pk: false,
        un: false,
        ai: false,
        clen: 45,
        np: null,
        ns: null,
        dtxp: '',
        dtxs: '',
        altered: 1,
        uidt: UITypes.CreatedTime,
        uip: '',
        uicn: '',
        system: true,
      },
      {
        column_name: 'updated_at',
        title: 'UpdatedAt',
        dt: 'datetime',
        dtx: 'specificType',
        ct: 'datetime',
        nrqd: true,
        rqd: false,
        ck: false,
        pk: false,
        un: false,
        ai: false,
        au: true,
        clen: 45,
        np: null,
        ns: null,
        dtxp: '',
        dtxs: '',
        altered: 1,
        uidt: UITypes.LastModifiedTime,
        uip: '',
        uicn: '',
        system: true,
      },
      {
        column_name: 'created_by',
        title: 'nc_created_by',
        dt: 'varchar',
        dtx: 'specificType',
        ct: 'varchar(45)',
        nrqd: true,
        rqd: false,
        ck: false,
        pk: false,
        un: false,
        ai: false,
        clen: 45,
        np: null,
        ns: null,
        dtxp: '45',
        dtxs: '',
        altered: 1,
        uidt: UITypes.CreatedBy,
        uip: '',
        uicn: '',
        system: true,
      },
      {
        column_name: 'updated_by',
        title: 'nc_updated_by',
        dt: 'varchar',
        dtx: 'specificType',
        ct: 'varchar(45)',
        nrqd: true,
        rqd: false,
        ck: false,
        pk: false,
        un: false,
        ai: false,
        clen: 45,
        np: null,
        ns: null,
        dtxp: '45',
        dtxs: '',
        altered: 1,
        uidt: UITypes.LastModifiedBy,
        uip: '',
        uicn: '',
        system: true,
      },
      {
        column_name: 'nc_order',
        title: 'nc_order',
        dt: 'decimal',
        dtx: 'specificType',
        ct: 'decimal(38,19)',
        nrqd: true,
        rqd: false,
        ck: false,
        pk: false,
        un: false,
        ai: false,
        cdf: null,
        clen: null,
        np: 38,
        ns: 19,
        dtxp: '38,19',
        dtxs: '',
        altered: 1,
        uidt: UITypes.Order,
        uip: '',
        uicn: '',
        system: true,
      },
    ];
  }

  static getNewColumn(suffix) {
    return {
      column_name: 'title' + suffix,
      dt: 'TEXT',
      dtx: 'specificType',
      ct: null,
      nrqd: true,
      rqd: false,
      ck: false,
      pk: false,
      un: false,
      ai: false,
      cdf: null,
      clen: null,
      np: null,
      ns: null,
      dtxp: '',
      dtxs: '',
      altered: 1,
      uidt: 'SingleLineText',
      uip: '',
      uicn: '',
    };
  }

  static getDefaultLengthForDatatype(type) {
    switch (type) {
      case 'decimal':
        return 10;
      case 'varchar':
        return 255;
      default:
        return '';
    }
  }

  static getDefaultLengthIsDisabled(type) {
    switch (type) {
      case 'nvarchar':
      case 'numeric':
      case 'decimal':
      case 'varchar':
        return false;
      default:
        return true;
    }
  }

  static getDefaultValueForDatatype(type) {
    switch (type) {
      case 'bigint':
      case 'binary':
      case 'bit':
      case 'char':
      case 'date':
      case 'datetime':
      case 'datetime2':
      case 'datetimeoffset':
      case 'decimal':
      case 'float':
      case 'geography':
      case 'geometry':
      case 'heirarchyid':
      case 'image':
      case 'int':
      case 'money':
      case 'nchar':
      case 'ntext':
      case 'numeric':
      case 'nvarchar':
      case 'real':
      case 'json':
      case 'smalldatetime':
      case 'smallint':
      case 'smallmoney':
      case 'sql_variant':
      case 'sysname':
      case 'text':
      case 'time':
      case 'timestamp':
      case 'tinyint':
      case 'uniqueidentifier':
      case 'varbinary':
      case 'xml':
      case 'varchar':
        return 'eg: ';
      default:
        return '';
    }
  }

  static getDefaultScaleForDatatype(type) {
    switch (type) {
      case 'decimal':
      case 'numeric':
        return '2';
      default:
        return '';
    }
  }

  static colPropAIDisabled(col, columns) {
    // console.log(col);
    if (
      col.dt === 'int4' ||
      col.dt === 'integer' ||
      col.dt === 'bigint' ||
      col.dt === 'smallint'
    ) {
      for (let i = 0; i < columns.length; ++i) {
        if (columns[i].cn !== col.cn && columns[i].ai) {
          return true;
        }
      }
      return false;
    } else {
      return true;
    }
  }

  static colPropUNDisabled(_col) {
    return true;
  }

  static onCheckboxChangeAI(col) {
    console.log(col);
    if (
      col.dt === 'int' ||
      col.dt === 'bigint' ||
      col.dt === 'smallint' ||
      col.dt === 'tinyint'
    ) {
      col.altered = col.altered || 2;
    }
  }

  static showScale(columnObj) {
    return columnObj.dt === 'decimal' || columnObj.dt === 'numeric';
  }

  static removeUnsigned(columns) {
    for (let i = 0; i < columns.length; ++i) {
      if (
        columns[i].altered === 1 &&
        !(
          columns[i].dt === 'int' ||
          columns[i].dt === 'bigint' ||
          columns[i].dt === 'tinyint' ||
          columns[i].dt === 'smallint' ||
          columns[i].dt === 'mediumint'
        )
      ) {
        columns[i].un = false;
        console.log('>> resetting unsigned value', columns[i].cn);
      }
      console.log(columns[i].cn);
    }
  }

  static columnEditable(colObj) {
    return colObj.tn !== '_evolutions' || colObj.tn !== 'nc_evolutions';
  }

  /*

  static extractFunctionName(query) {
    const reg =
      /^\s*CREATE\s+(?:OR\s+REPLACE\s*)?\s*FUNCTION\s+(?:[\w\d_]+\.)?([\w_\d]+)/i;
    const match = query.match(reg);
    return match && match[1];
  }

  static extractProcedureName(query) {
    const reg =
      /^\s*CREATE\s+(?:OR\s+REPLACE\s*)?\s*PROCEDURE\s+(?:[\w\d_]+\.)?([\w_\d]+)/i;
    const match = query.match(reg);
    return match && match[1];
  }

  static handleRawOutput(result, headers) {
    console.log(result);

    if (Array.isArray(result) && result[0]) {
      const keys = Object.keys(result[0]);
      // set headers before settings result
      for (let i = 0; i < keys.length; i++) {
        const text = keys[i];
        headers.push({ text, value: text, sortable: false });
      }
    } else if (result === undefined) {
      headers.push({ text: 'Message', value: 'message', sortable: false });
      result = [{ message: 'Success' }];
    }
    return result;
  }

  static splitQueries(query) {
    /!***
     * we are splitting based on semicolon
     * there are mechanism to escape semicolon within single/double quotes(string)
     *!/
    return query.match(/\b("[^"]*;[^"]*"|'[^']*;[^']*'|[^;])*;/g);
  }

  /!**
   * if sql statement is SELECT - it limits to a number
   * @param args
   * @returns {string|*}
   *!/
  sanitiseQuery(args) {
    let q = args.query.trim().split(';');

    if (q[0].startsWith('Select')) {
      q = q[0] + ` LIMIT 0,${args.limit ? args.limit : 100};`;
    } else if (q[0].startsWith('select')) {
      q = q[0] + ` LIMIT 0,${args.limit ? args.limit : 100};`;
    } else if (q[0].startsWith('SELECT')) {
      q = q[0] + ` LIMIT 0,${args.limit ? args.limit : 100};`;
    } else {
      return args.query;
    }

    return q;
  }

  static getColumnsFromJson(json, tn) {
    const columns = [];

    try {
      if (typeof json === 'object' && !Array.isArray(json)) {
        const keys = Object.keys(json);
        for (let i = 0; i < keys.length; ++i) {
          const column = {
            dp: null,
            tn,
            column_name: keys[i],
            cno: keys[i],
            np: 10,
            ns: 0,
            clen: null,
            cop: 1,
            pk: false,
            nrqd: false,
            rqd: false,
            un: false,
            ct: 'int(11) unsigned',
            ai: false,
            unique: false,
            cdf: null,
            cc: '',
            csn: null,
            dtx: 'specificType',
            dtxp: null,
            dtxs: 0,
            altered: 1,
          };

          switch (typeof json[keys[i]]) {
            case 'number':
              if (Number.isInteger(json[keys[i]])) {
                if (MssqlUi.isValidTimestamp(keys[i], json[keys[i]])) {
                  Object.assign(column, {
                    dt: 'timestamp',
                  });
                } else {
                  Object.assign(column, {
                    dt: 'int',
                    np: 10,
                    ns: 0,
                  });
                }
              } else {
                Object.assign(column, {
                  dt: 'float',
                  np: 10,
                  ns: 2,
                  dtxp: '11',
                  dtxs: 2,
                });
              }
              break;
            case 'string':
              if (MssqlUi.isValidDate(json[keys[i]])) {
                Object.assign(column, {
                  dt: 'datetime',
                });
              } else if (json[keys[i]].length <= 255) {
                Object.assign(column, {
                  dt: 'varchar',
                  np: 255,
                  ns: 0,
                  dtxp: '255',
                });
              } else {
                Object.assign(column, {
                  dt: 'text',
                });
              }
              break;
            case 'boolean':
              Object.assign(column, {
                dt: 'bit',
                np: null,
                ns: 0,
              });
              break;
            case 'object':
              Object.assign(column, {
                dt: 'varchar',
                np: 255,
                ns: 0,
                dtxp: '255',
              });
              break;
            default:
              break;
          }
          columns.push(column);
        }
      }
    } catch (e) {
      console.log('Error in getColumnsFromJson', e);
    }

    return columns;
  }

  static isValidTimestamp(key, value) {
    if (typeof value !== 'number') {
      return false;
    }
    return new Date(value).getTime() > 0 && /(?:_|(?=A))[aA]t$/.test(key);
  }

  static isValidDate(value) {
    return new Date(value).getTime() > 0;
  }
*/

  static onCheckboxChangeAU(col) {
    console.log(col);
    // if (1) {
    col.altered = col.altered || 2;
    // }
    if (col.au) {
      col.cdf = 'GETDATE()';
    }
    // if (!col.ai) {
    //   col.dtx = 'specificType'
    // } else {
    //   col.dtx = ''
    // }
  }

  static colPropAuDisabled(col) {
    if (col.altered !== 1) {
      return true;
    }

    switch (col.dt) {
      case 'date':
      case 'datetime':
      case 'datetime2':
      case 'datetimeoffset':
      case 'time':
      case 'timestamp':
        return false;

      default:
        return true;
    }
  }

  static getAbstractType(col): any {
    switch (col.dt?.toLowerCase()) {
      case 'bigint':
      case 'smallint':
      case 'bit':
      case 'tinyint':
      case 'int':
        return 'integer';

      case 'binary':
        return 'string';

      case 'char':
        return 'string';

      case 'date':
        return 'date';
      case 'datetime':
      case 'datetime2':
      case 'smalldatetime':
      case 'datetimeoffset':
        return 'datetime';
      case 'decimal':
      case 'float':
        return 'float';

      case 'geography':
      case 'geometry':
      case 'heirarchyid':
      case 'image':
        return 'string';

      case 'money':
      case 'nchar':
        return 'string';

      case 'ntext':
        return 'text';
      case 'numeric':
        return 'float';
      case 'nvarchar':
        return 'string';
      case 'real':
        return 'float';

      case 'json':
        return 'json';

      case 'smallmoney':
      case 'sql_variant':
      case 'sysname':
        return 'string';
      case 'text':
        return 'text';
      case 'time':
        return 'time';
      case 'timestamp':
        return 'timestamp';

      case 'uniqueidentifier':
      case 'varbinary':
      case 'xml':
        return 'string';
      case 'varchar':
        return 'string';
    }
    return 'string';
  }

  static getUIType(col): any {
    switch (this.getAbstractType(col)) {
      case 'integer':
        return 'Number';
      case 'boolean':
        return 'Checkbox';
      case 'float':
        return 'Decimal';
      case 'date':
        return 'Date';
      case 'datetime':
        return 'CreatedTime';
      case 'time':
        return 'Time';
      case 'year':
        return 'Year';
      case 'string':
        return 'SingleLineText';
      case 'text':
        return 'LongText';
      case 'blob':
        return 'Attachment';
      case 'enum':
        return 'SingleSelect';
      case 'set':
        return 'MultiSelect';
      case 'json':
        return 'LongText';
    }
  }

  static getDataTypeForUiType(
    col: { uidt: UITypes },
    idType?: IDType
  ): {
    readonly dt: string;
    readonly [key: string]: any;
  } {
    const colProp: any = {};
    switch (col.uidt) {
      case 'ID':
        {
          const isAutoIncId = idType === 'AI';
          const isAutoGenId = idType === 'AG';
          colProp.dt = isAutoGenId ? 'varchar' : 'int';
          colProp.pk = true;
          colProp.un = isAutoIncId;
          colProp.ai = isAutoIncId;
          colProp.rqd = true;
          colProp.meta = isAutoGenId ? { ag: 'nc' } : undefined;
        }
        break;
      case 'ForeignKey':
        colProp.dt = 'varchar';
        break;
      case 'SingleLineText':
        colProp.dt = 'text';
        break;
      case 'LongText':
        colProp.dt = 'text';
        break;
      case 'Attachment':
        colProp.dt = 'text';
        break;
      case 'Checkbox':
        colProp.dt = 'tinyint';
        colProp.dtxp = 1;
        colProp.cdf = '0';
        break;
      case 'MultiSelect':
        colProp.dt = 'text';
        break;
      case 'SingleSelect':
        colProp.dt = 'text';
        break;
      case 'Collaborator':
        colProp.dt = 'varchar';
        break;
      case 'GeoData':
        colProp.dt = 'varchar';
        break;
      case 'Date':
        colProp.dt = 'date';
        break;
      case 'Year':
        colProp.dt = 'int';
        break;
      case 'Time':
        colProp.dt = 'time';
        break;
      case 'PhoneNumber':
        colProp.dt = 'varchar';
        colProp.validate = {
          func: ['isMobilePhone'],
          args: [''],
          msg: ['Validation failed : isMobilePhone'],
        };
        break;
      case 'Email':
        colProp.dt = 'varchar';
        colProp.validate = {
          func: ['isEmail'],
          args: [''],
          msg: ['Validation failed : isEmail'],
        };
        break;
      case 'URL':
        colProp.dt = 'text';
        colProp.validate = {
          func: ['isURL'],
          args: [''],
          msg: ['Validation failed : isURL'],
        };
        break;
      case 'Number':
        colProp.dt = 'int';
        break;
      case 'Decimal':
        colProp.dt = 'decimal';
        break;
      case 'Currency':
        colProp.dt = 'decimal';
        colProp.validate = {
          func: ['isCurrency'],
          args: [''],
          msg: ['Validation failed : isCurrency'],
        };
        break;
      case 'Percent':
        colProp.dt = 'double';
        break;
      case 'Duration':
        colProp.dt = 'decimal';
        break;
      case 'Rating':
        colProp.dt = 'int';
        colProp.cdf = '0';
        break;
      case 'Formula':
        colProp.dt = 'varchar';
        break;
      case 'Rollup':
        colProp.dt = 'varchar';
        break;
      case 'Count':
        colProp.dt = 'int';
        break;
      case 'Lookup':
        colProp.dt = 'varchar';
        break;
      case 'DateTime':
        colProp.dt = 'datetimeoffset';
        break;
      case 'CreatedTime':
        colProp.dt = 'datetime';
        break;
      case 'LastModifiedTime':
        colProp.dt = 'datetime';
        break;
      case 'AutoNumber':
        colProp.dt = 'int';
        break;
      case 'Barcode':
        colProp.dt = 'varchar';
        break;
      case 'Button':
        colProp.dt = 'varchar';
        break;
      default:
        colProp.dt = 'varchar';
        break;
    }
    return colProp;
  }

  static getDataTypeListForUiType(col, idType?: IDType) {
    switch (col.uidt) {
      case 'ID':
        if (idType === 'AG') {
          return ['char', 'ntext', 'text', 'varchar', 'nvarchar'];
        } else if (idType === 'AI') {
          return ['int', 'bigint', 'bit', 'smallint', 'tinyint'];
        } else {
          return dbTypes;
        }
      case 'ForeignKey':
        return dbTypes;

      case 'SingleLineText':
      case 'LongText':
      case 'Attachment':
      case 'Collaborator':
      case 'GeoData':
        return ['text', 'varchar', 'nvarchar', 'char', 'ntext'];

      case 'JSON':
        return ['text', 'ntext'];

      case 'Checkbox':
        return ['bigint', 'bit', 'int', 'tinyint'];

      case 'MultiSelect':
        return ['text', 'ntext'];

      case 'SingleSelect':
        return ['text', 'ntext'];

      case 'Year':
        return ['int'];

      case 'Time':
        return ['time'];

      case 'PhoneNumber':
      case 'Email':
        return ['varchar'];

      case 'URL':
        return ['text', 'varchar'];

      case 'Number':
        return [
          'int',
          'bigint',
          'bit',
          'decimal',
          'float',
          'numeric',
          'real',
          'smallint',
          'tinyint',
        ];

      case 'Decimal':
        return ['decimal', 'float'];

      case 'Currency':
        return [
          'int',
          'bigint',
          'bit',
          'decimal',
          'float',
          'numeric',
          'real',
          'smallint',
          'tinyint',
          'money',
        ];

      case 'Percent':
        return [
          'int',
          'bigint',
          'bit',
          'decimal',
          'float',
          'numeric',
          'real',
          'smallint',
          'tinyint',
        ];

      case 'Duration':
        return [
          'int',
          'bigint',
          'bit',
          'decimal',
          'float',
          'numeric',
          'real',
          'smallint',
          'tinyint',
        ];

      case 'Rating':
        return [
          'int',
          'bigint',
          'bit',
          'decimal',
          'float',
          'numeric',
          'real',
          'smallint',
          'tinyint',
        ];

      case 'Formula':
      case 'Button':
        return ['text', 'ntext', 'varchar', 'nvarchar'];

      case 'Rollup':
        return ['varchar'];

      case 'Count':
        return ['int', 'bigint', 'smallint', 'tinyint'];

      case 'Lookup':
        return ['varchar'];

      case 'Date':
        return ['date'];

      case 'DateTime':
      case 'CreatedTime':
      case 'LastModifiedTime':
        return [
          'datetimeoffset',
          'datetime2',
          // 'datetime'
        ];

      case 'AutoNumber':
        return ['int', 'bigint', 'smallint', 'tinyint'];

      case 'Barcode':
        return ['varchar'];

      case 'Geometry':
        return ['geometry'];

      default:
        return dbTypes;
    }
  }

  static getUnsupportedFnList() {
    return [
      'XOR',
      'REGEX_MATCH',
      'REGEX_EXTRACT',
      'REGEX_REPLACE',
      'VALUE',
      'COUNTA',
      'COUNT',
      'ROUNDDOWN',
      'ROUNDUP',
      'DATESTR',
    ];
  }

  static getCurrentDateDefault(_col: Partial<ColumnType>) {
    return null;
  }

  static isEqual(dataType1: string, dataType2: string) {
    if (dataType1 === dataType2) return true;

    const abstractType1 = this.getAbstractType({ dt: dataType1 });
    const abstractType2 = this.getAbstractType({ dt: dataType2 });

    if (
      abstractType1 &&
      abstractType1 === abstractType2 &&
      ['integer', 'float'].includes(abstractType1)
    )
      return true;

    return false;
  }
  //#endregion statics

  //#region methods
  getNewTableColumns(): readonly any[] {
    return MssqlUi.getNewTableColumns();
  }
  getNewColumn(suffix: string): {
    column_name: string;
    dt: string;
    dtx: string;
    ct: string;
    nrqd: boolean;
    rqd: boolean;
    ck: boolean;
    pk: boolean;
    un: boolean;
    ai: boolean;
    cdf: null;
    clen: number;
    np: number;
    ns: number;
    dtxp: string;
    dtxs: string;
    altered: number;
    uidt: string;
    uip: string;
    uicn: string;
  } {
    return MssqlUi.getNewColumn(suffix);
  }
  getDefaultLengthForDatatype(type: string): number | string {
    return MssqlUi.getDefaultLengthForDatatype(type);
  }
  getDefaultLengthIsDisabled(type: string) {
    return MssqlUi.getDefaultLengthIsDisabled(type);
  }
  getDefaultValueForDatatype(type: string) {
    return MssqlUi.getDefaultValueForDatatype(type);
  }
  getDefaultScaleForDatatype(type: any): string {
    return MssqlUi.getDefaultScaleForDatatype(type);
  }
  colPropAIDisabled(col: ColumnType, columns: ColumnType[]): boolean {
    return MssqlUi.colPropAIDisabled(col, columns);
  }
  colPropUNDisabled(col: ColumnType): boolean {
    return MssqlUi.colPropUNDisabled(col);
  }
  onCheckboxChangeAI(col: ColumnType): void {
    return MssqlUi.onCheckboxChangeAI(col);
  }
  showScale(columnObj: ColumnType): boolean {
    return MssqlUi.showScale(columnObj);
  }
  removeUnsigned(columns: ColumnType[]): void {
    return MssqlUi.removeUnsigned(columns);
  }
  columnEditable(colObj: ColumnType): boolean {
    return MssqlUi.columnEditable(colObj);
  }
  onCheckboxChangeAU(col: ColumnType): void {
    return MssqlUi.onCheckboxChangeAU(col);
  }
  colPropAuDisabled(col: ColumnType): boolean {
    return MssqlUi.colPropAuDisabled(col);
  }
  getAbstractType(col: ColumnType): string {
    return MssqlUi.getAbstractType(col);
  }
  getUIType(col: ColumnType): string {
    return MssqlUi.getUIType(col);
  }
  getDataTypeForUiType(col: { uidt: UITypes }, idType?: IDType) {
    return MssqlUi.getDataTypeForUiType(col, idType);
  }
  getDataTypeListForUiType(col: { uidt: UITypes }, idType?: IDType): string[] {
    return MssqlUi.getDataTypeListForUiType(col, idType);
  }
  getUnsupportedFnList(): string[] {
    return MssqlUi.getUnsupportedFnList();
  }
  getCurrentDateDefault(_col: Partial<ColumnType>) {
    return MssqlUi.getCurrentDateDefault(_col);
  }
  isEqual(dataType1: string, dataType2: string): boolean {
    return MssqlUi.isEqual(dataType1, dataType2);
  }
  adjustLengthAndScale(newColumn: Partial<ColumnType>, oldColumn?: ColumnType) {
    if (newColumn.dt === 'decimal') {
      // get old column length and default length
      const defaultDtxp: number = numberize(
        this.getDefaultLengthForDatatype(newColumn.dt)
      );
      let lastDtxp = defaultDtxp;
      if (oldColumn) {
        lastDtxp = numberize(oldColumn.dtxp) ?? lastDtxp;
      }
      // get default and new column scale
      const defaultDtxs = numberize(
        this.getDefaultScaleForDatatype(newColumn.dt)
      );
      const newDtxs = numberize(newColumn.dtxs) ?? defaultDtxs;

      // get new column length based on scale and old length
      // get whichever is the highest, old column length,
      // default column length or default + precision - default if precision > default
      const newDtxp = Math.max(
        defaultDtxp,
        lastDtxp,
        defaultDtxp + Math.max(newDtxs - defaultDtxs, 0)
      );
      newColumn.dtxp = newDtxp;
      newColumn.dtxs = newDtxs;
    }
  }
  isParsedJsonReturnType(_col: ColumnType): boolean {
    return false;
  }
  get tableNameLengthLimit(): number {
    return 255;
  }
  //#endregion methods
}
