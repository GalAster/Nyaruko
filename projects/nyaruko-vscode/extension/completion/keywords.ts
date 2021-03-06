import * as vscode from 'vscode'
import { getSuggestions, wordContains } from '../utils'
import { Tokens } from '@nyar/tmlang'
export const Keywords = ['Auto'].concat(Tokens.Keywords)


export function SuggestKeywords(word: string): Thenable<vscode.CompletionItem[]> {
    const show = vscode.CompletionItemKind.Keyword
    let cmd = new Promise((resolve, reject) => {
        resolve(Keywords.join('\n'))
    })
    function formatter(input: string) {
        return input
    }
    return getSuggestions(cmd, word, show, formatter, wordContains)
}
