export default class TemplateGenerator {
  progressCallback?: (msg: ProgressMessageType) => void

  constructor(progressCallback?: (msg: ProgressMessageType) => void) {
    this.progressCallback = progressCallback
  }

  progress(msg: ProgressMessageType) {
    this.progressCallback?.(msg)
  }

  init() {}

  parse() {
    throw new Error("'parse' method is not implemented")
  }

  parseData() {
    throw new Error("'parseData' method is not implemented")
  }

  parseTemplate() {
    throw new Error("'parseTemplate' method is not implemented")
  }

  getColumns() {
    throw new Error("'getColumns' method is not implemented")
  }

  getTemplate() {
    throw new Error("'getTemplate' method is not implemented")
  }

  getData() {
    throw new Error("'getData' method is not implemented")
  }
}

export interface ProgressMessageObjType {
  title: string
  value: string
}
export type ProgressMessageType = string | ProgressMessageObjType
