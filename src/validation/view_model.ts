import * as ko from 'knockout'
import * as amf from 'amf-client-js'
const Vocabularies = amf.plugins.document.Vocabularies

export class ViewModel {
  public dialectModel: any | null = null;
  public documentModel: any | null = null;

  public changesFromLastUpdate = 0;
  public someModelChanged = false;
  public RELOAD_PERIOD = 1000;

  public amlParser?
  public profileName: amf.ProfileName;

  public base = window.location.href.toString().replace('validation.html', '')
  public defaultDocUrl = 'http://a.ml/amf/default_document'

  public constructor (public dialectEditor: any, public documentEditor: any) {
    amf.AMF.init()
      .then(() => {
        this.amlParser = new amf.Aml10Parser()
        return this.loadInitialDialect()
      })
      .then(() => {
        return this.loadInitialDocument()
      })

    this.documentEditor.onDidChangeModelContent(() => {
      this.handleModelContentChange(this.updateDocumentEditorContent)
    })
    this.dialectEditor.onDidChangeModelContent(() => {
      this.handleModelContentChange(() => {
        return this.registerDialectEditorContent()
          .then(() => {
            // It's necessary to re-parse document in terms of new dialect to
            // make validation work.
            return this.updateDocumentEditorContent()
          })
      })
    })
  }

  public apply () {
    window['viewModel'] = this
    ko.applyBindings(this)
  }

  public createModel (text, mode) {
    return window['monaco'].editor.createModel(text, mode)
  }

  public handleModelContentChange (parsingFn) {
    this.changesFromLastUpdate++
    this.someModelChanged = true;
    ((number) => {
      setTimeout(() => {
        if (this.changesFromLastUpdate === number) {
          this.changesFromLastUpdate = 0
          parsingFn.call(this)
        }
      }, this.RELOAD_PERIOD)
    })(this.changesFromLastUpdate)
  }

  public loadInitialDialect () {
    this.changesFromLastUpdate = 0
    const dialectPath = `${this.base}spec_examples/music/dialect.yaml`
    return this.amlParser.parseFileAsync(dialectPath)
      .then(model => {
        this.dialectModel = model
        this.dialectEditor.setModel(this.createModel(this.dialectModel.raw, 'aml'))
        return this.registerDialectEditorContent()
      })
      .then(() => {
        return this.updateDocumentEditorContent()
      })
  }

  public registerDialectEditorContent () {
    const editorValue = this.dialectEditor.getValue()
    if (!editorValue) {
      return
    }
    const location = this.dialectModel.location || this.defaultDocUrl
    return Vocabularies.registerDialect(location, editorValue)
      .then(dialect => {
        this.profileName = new amf.ProfileName(dialect.nameAndVersion())
      })
  }

  public loadInitialDocument () {
    this.changesFromLastUpdate = 0
    const documentPath = `${this.base}spec_examples/music/document.yaml`
    return this.amlParser.parseFileAsync(documentPath)
      .then(model => {
        this.documentEditor.setModel(this.createModel(model.raw, 'aml'))
        this.documentModel = model
        this.doValidate()
      })
  }

  public updateDocumentEditorContent () {
    const editorValue = this.documentEditor.getValue()
    if (!editorValue) {
      return
    }
    return this.amlParser.parseStringAsync(editorValue)
      .then(model => {
        this.documentModel = model
        this.doValidate()
      })
      .catch((err) => {
        console.error(`Failed to parse document: ${err}`)
      })
  }

  public doValidate () {
    if (this.dialectModel === null || this.documentModel === null) {
      return
    }
    amf.AMF.validate(this.documentModel, this.profileName, amf.MessageStyles.RAML)
      .then(report => {
        const monacoErrors = report.results.map((result) => {
          return this.buildMonacoError(result)
        })
        const model = this.documentEditor.getModel()
        monaco.editor.setModelMarkers(model, model.id, monacoErrors)
        window['resizeFn']()
      })
      .catch(err => {
        console.error(`Failed to validate document: ${err}`)
      })
  }

  protected buildMonacoError (error: amf.validate.ValidationResult): any {
    let severity
    if (error.level === 'Violation') {
      severity = monaco.MarkerSeverity.Error
    } else if (error.level === 'Warning') {
      severity = monaco.MarkerSeverity.Warning
    } else {
      severity = monaco.MarkerSeverity.Info
    }
    return {
      severity: severity,
      startLineNumber: error.position.start.line,
      startColumn: error.position.start.column,
      endLineNumber: error.position.end.line,
      endColumn: error.position.end.column,
      message: error.message
    }
  }
}
