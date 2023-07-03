type TokenType = ''

type TokenSpan = {
  start: number,
  end: number
}

interface Token {
  type: TokenType
  span: TokenSpan
  value: string
}

interface Tokenizer extends Iterable<Token> {
  index: number
  length: number
  source: string
  tokens: Token[]
  error: Error | null
  lastToken: Token | null
}

interface SingleTokenizer {
  (source: string, ctx: Tokenizer): Token | null
}

// 特殊的保留字符
const specialCharacter: SingleTokenizer = (source, ctx) => {
  const character = source[0]
  const tokenType: TokenType | null = null
  const isMatched = ["[", "]", "(", ")", "[", "|", ".", "^", "$", "?", "+", "*"].includes(character)
  return {}
}

export function tokenizer(regexp: string): Tokenizer {
  const singleTokenizers: SingleTokenizer[] = [
    specialCharacter
  ]

  const self: Tokenizer = {
    source: regexp,
    index: 0,
    tokens: [],
    error: null,
    lastToken: null,
    length: regexp.length,
    [Symbol.iterator]: () => ({
      throw: () => ({
        done: true,
        value: self.error
      }),
      return: () => ({
        done: true,
        value: self.tokens
      }),
      next: () => {
        if (self.index >= self.length) {
          return {
            done: true,
            value: self.lastToken
          }
        }

        // 从 index 开始识别处理 token
        const source = self.source.slice(self.index)

        const matchedTokens = singleTokenizers
          .map(match => match(source, self))
          .filter((t: Token | null): t is Token => !!t)
          .sort((first, second) => first.span.end - second.span.end)

        // 没有识别的语法
        if (matchedTokens.length === 0) {
          const message = `unknown lexical at ${source}`
          self.error = new Error(message)
          self.index = self.length
        }

        const matchedToken = matchedTokens[0]
        self.index = matchedToken.span.end
        self.lastToken = matchedToken

        return {
          done: false,
          value: matchedToken
        }
      }
    })
  }

  return self
}
