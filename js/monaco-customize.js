function customizeMonaco () {
  // Register a new language
  monaco.languages.register({ id: 'aml' })

  // Register a tokens provider for the language
  monaco.languages.setMonarchTokensProvider('aml', {
    numberInteger: /(?:0|[+-]?[0-9]+)/,
    numberFloat: /(?:0|[+-]?[0-9]+)(?:\.[0-9]+)?(?:e[-+][1-9][0-9]*)?/,
    numberOctal: /0o[0-7]+/,
    numberHex: /0x[0-9a-fA-F]+/,
    numberInfinity: /[+-]?\.(?:inf|Inf|INF)/,
    numberNaN: /\.(?:nan|Nan|NAN)/,
    numberDate: /\d{4}-\d\d-\d\d([Tt ]\d\d:\d\d:\d\d(\.\d+)?(( ?[+-]\d\d?(:\d\d)?)|Z)?)?/,
    escapes: /\\(?:[btnfr\\"']|[0-7][0-7]?|[0-3][0-7]{2})/,
    keywords: ['true', 'True', 'TRUE', 'false', 'False', 'FALSE', 'null', 'Null', 'Null', '~'],
    brackets: [{token: 'delimiter.bracket', open: '{', close: '}'}, {token: 'delimiter.square', open: '[', close: ']'}],

    tokenizer: {
      root: [
        [/\/.*(?=:)/,"special"],
        [/#%.*/,"syntaxTag"],
        [/\![^ ]*/,"tag"],
        [/#.*/,"rootComment"],
        {include:"@comment"},
        {include:"@whitespace"},
        [/%[^ ]+.*$/,"meta.directive"],
        [/---/,"operators.directivesEnd"],
        [/\.{3}/,"operators.documentEnd"],
        [/[-?:](?= )/,"operators"],
        {include:"@anchor"},
        {include:"@tagHandle"},
        {include:"@flowCollections"},
        {include:"@blockStyle"},
        [/@numberInteger(?![ \t]*\S+)/,"number"],
        [/@numberFloat(?![ \t]*\S+)/,"number.float"],
        [/@numberOctal(?![ \t]*\S+)/,"number.octal"],
        [/@numberHex(?![ \t]*\S+)/,"number.hex"],
        [/@numberInfinity(?![ \t]*\S+)/,"number.infinity"],
        [/@numberNaN(?![ \t]*\S+)/,"number.nan"],
        [/@numberDate(?![ \t]*\S+)/,"number.date"],
        [/(".*?"|'.*?'|.*?)([ \t]*)(:)( |$)/,
          ["type","white","operators","white"]
        ],
        {include:"@flowScalars"},
        [/.+(?=#)/,{cases:{"@keywords":"keyword","@default":"string"}}],
        [/.+$/,{cases:{"@keywords":"keyword","@default":"string"}}],
      ],

      object: [{include: '@whitespace'}, {include: '@comment'}, [/\}/, '@brackets', '@pop'], [/,/, 'delimiter.comma'], [/:(?= )/, 'operators'], [/(?:".*?"|'.*?'|[^,\{\[]+?)(?=: )/, 'type'], {include: '@flowCollections'}, {include: '@flowScalars'}, {include: '@tagHandle'}, {include: '@anchor'}, {include: '@flowNumber'}, [/[^\},]+/, {cases: {'@keywords': 'keyword', '@default': 'string'}}]],

      array: [{include: '@whitespace'}, {include: '@comment'}, [/\]/, '@brackets', '@pop'], [/,/, 'delimiter.comma'], {include: '@flowCollections'}, {include: '@flowScalars'}, {include: '@tagHandle'}, {include: '@anchor'}, {include: '@flowNumber'}, [/[^\],]+/, {cases: {'@keywords': 'keyword', '@default': 'string'}}]],

      multiString: [[/^( +).+$/, 'string', '@multiStringContinued.$1']],

      multiStringContinued: [[/^( *).+$/, {cases: {'$1==$S2': 'string', '@default': {token: '@rematch', next: '@popall'}}}]],

      whitespace: [[/[ \t\r\n]+/, 'white']],

      comment: [[/#.*/, 'comment']],

      flowCollections: [[/\[/, '@brackets', '@array'], [/\{/, '@brackets', '@object']],

      flowScalars: [[/"([^"\\]|\\.)*$/, 'string.invalid'], [/'([^'\\]|\\.)*$/, 'string.invalid'], [/'[^']*'/, 'string'], [/"/, 'string', '@doubleQuotedString']],

      doubleQuotedString: [[/[^\\"]+/, 'string'], [/@escapes/, 'string.escape'], [/\\./, 'string.escape.invalid'], [/"/, 'string', '@pop']],

      blockStyle: [[/[>|][0-9]*[+-]?$/, 'operators', '@multiString']],

      flowNumber: [[/@numberInteger(?=[ \t]*[,\]\}])/, 'number'], [/@numberFloat(?=[ \t]*[,\]\}])/, 'number.float'], [/@numberOctal(?=[ \t]*[,\]\}])/, 'number.octal'], [/@numberHex(?=[ \t]*[,\]\}])/, 'number.hex'], [/@numberInfinity(?=[ \t]*[,\]\}])/, 'number.infinity'], [/@numberNaN(?=[ \t]*[,\]\}])/, 'number.nan'], [/@numberDate(?=[ \t]*[,\]\}])/, 'number.date']],

      tagHandle: [[/\![^ ]*/, 'tag']],

      anchor: [[/[&*][^ ]+/, 'namespace']]
    }
  })
  monaco.editor.defineTheme('amlTheme', {
    base: 'vs-dark', // vs, hc-black, vs-dark
    inherit: true,
    rules: [{ background: 'EDF9FA' },
        {token : 'type', foreground: "#26d3ff"},
        {token : 'special', foreground:'#BDB7F4'},
        {token : 'string', foreground: '#00b3de'},
        {token : 'keyword', foreground: '#cccccc'},
        {token : 'number', foreground: '#bdf1a3'},
        {token : 'syntaxTag', foreground: '#9dd288'},
        {token : 'tag', foreground: '#9dd288'},
        {token : 'rootComment', foreground: '#9dd288'},
        {token : 'httpMethod', foreground: '#ffb647'}
      ],
    colors: {
      'editor.foreground': '#000000',
      'editor.background': '#526881',
      'editor.lineHighlightBackground': '#4e4e4e',
      'editor.lineHighlightForeground': '#4e4e4e',
      'editor.selectionBackground': '#4e4e4e',
      'editor.selectionForeground': '#4e4e4e',
      'editor.selectionHighlightBackground': '#4e4e4e',
      'editor.selectionHighlightForeground': '#4e4e4e',
      'editor.inactiveSelectionBackground': '#4e4e4e',
      'editor.hoverHighlightBackground': '#4e4e4e',
      'editor.hoverHighlightForeground': '#4e4e4e',
      'editorCursor.foreground': '#8B0000',
      'editorLineNumber.foreground': '#008800',
      'input.background': '#FFFFFF',
      'editorHoverWidget.background': '#F7FAFF',
      'editorHoverWidget.border': '#4e4e4e',
      'editorIndentGuide.background': '#9EAAB7'
    }
  })
  monaco.editor.setTheme('amlTheme')
}
