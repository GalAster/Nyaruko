const strrrr = {
    'patterns': [
        {
            'match': '\\\\.',
            'name': 'constant.character.escape.shell'
        },
        {
            'begin': "'",
            'beginCaptures': {
                '0': {
                    'name': 'punctuation.definition.string.begin.shell'
                }
            },
            'end': "'",
            'endCaptures': {
                '0': {
                    'name': 'punctuation.definition.string.end.shell'
                }
            },
            'name': 'string.quoted.single.shell'
        },
        {
            'begin': '\\$?"',
            'beginCaptures': {
                '0': {
                    'name': 'punctuation.definition.string.begin.shell'
                }
            },
            'end': '"',
            'endCaptures': {
                '0': {
                    'name': 'punctuation.definition.string.end.shell'
                }
            },
            'name': 'string.quoted.double.shell',
            'patterns': [
                {
                    'match': '\\\\[\\$`"\\\\\\n]',
                    'name': 'constant.character.escape.shell'
                },
                {
                    'include': '#variable'
                },
                {
                    'include': '#interpolation'
                }
            ]
        },
        {
            'begin': "\\$'",
            'beginCaptures': {
                '0': {
                    'name': 'punctuation.definition.string.begin.shell'
                }
            },
            'end': "'",
            'endCaptures': {
                '0': {
                    'name': 'punctuation.definition.string.end.shell'
                }
            },
            'name': 'string.quoted.single.dollar.shell',
            'patterns': [
                {
                    'match': "\\\\(a|b|e|f|n|r|t|v|\\\\|')",
                    'name': 'constant.character.escape.ansi-c.shell'
                },
                {
                    'match': '\\\\[0-9]{3}',
                    'name': 'constant.character.escape.octal.shell'
                },
                {
                    'match': '\\\\x[0-9a-fA-F]{2}',
                    'name': 'constant.character.escape.hex.shell'
                },
                {
                    'match': '\\\\c.',
                    'name': 'constant.character.escape.control-char.shell'
                }
            ]
        }
    ]
}