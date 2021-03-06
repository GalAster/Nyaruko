# Keyword

关键词是被官方用掉的符号, 本质上是一种宏.

关键词宏机制是这样的:

1. Nyar 与 JS 类似被设定成可以被压缩成一行的语言.
2. 同样的我们使用 `;` 来隔开行或区分歧义, 一般使用是不需要加 `;` 的.
3. `{ }` 对是不能单独存在的, 必定有一个宏对应.
4. 从 StartOfLine(SOL) 开始检测, 如果有 `{` 计数 +1, `}` 计数 -1, 减到 0 确定一个宏.
5. 宏最多有触发器 `(Macro)` , 捕捉域 `(Statement)` , 辅助宏 `(Sub_Macro)` , 作用域 `(Scope)` 四个部分.
6. 触发器, 作用域只有一个. 但没有规定捕捉域和辅助宏只有一个.
7. 宏可以嵌套, 但只能嵌套在作用域里, 捕捉域如果有歧义(比如空格)必须用 `()` 包裹.
8. 这里的宏说的是关键词宏, 你甚至可以认为宏是一种嵌入式语言, **Keyword Macros** 只是为了长得像 **Keyword** 而这么定义.
9. 上面说的这些实际上对于真正的宏来说完全可以不遵守.

```ts
Include (setting.nyar)
Import module as m
class test {
    Macro state1 state2 Sub_Macro state3 state4 {
        s = 0
        For (x, y) In range(1, 5) {
            s += x + y
        }
    }
}
```

这里的 Include, Import As, class , Macro, For In 属于关键词, 关键词几乎都有不带辅助关键词的版本

- **Macro 的概念来自 Lisp Macro, Lisp 宏当然都是这么霸道的**

## 宏定义(Macro)

符号 `Macro` 用于定义宏

一般不建议使用宏, 除非你是 Lisp 大师, 但是高亮系统也不会去管你的自定义语义了.

## 算符宏(Operate)

Nyar 对 Symbol 的态度与 Mathematica 类似, 不区分宏, 函数, 变量之类的.

但是你一旦赋值, 在被 Remove 之前是不可以改变类型的.

表达式模式 `f(a*) := b` 实际上是通过 `Macro` 来实现的.

```ts
Macro Symbol Pattern := Scope {
    %%% doc
        f(a*::Number, b*::Number) => Number := a + b
    ==> complex macro expand
    ==> Definition(
            Typed(f, Transformed(Tuple(Type(Number), Type(Number)), Type(Number))),
            SetDelayed(f(Pattern(a, Blank()), Pattern(b, Blank())), Plus(a, b))
        )
    %%%
}
```

## 模板宏(Template)

一种亚宏, 比 `Macro` 表现力弱, 本身一般得用 `Macro` 来定义.

模板的语法是模板名 + 符号名, 里面可以定义函数

Return 一般由模板的创造者规定, 函数和变量会被先执行, 然后执行模板

有子模板存在, 子模板就只能有个模板名了, 一般来说是 json 对象.

模板作为宏的替代品而存在,

```ts
Template module.tp_name sym_name {
    f(x*): = y
    h = f(x)

    Sub_Template {
        key: [value1, value2]
    }

}
```

## 类定义(Class)

类是个被固定了的模板, 用于生成对象.

```ts
%%% 类宏一般有如下模板宏 %%%
class A Extents B {
    Constructor (a*) {
        %%% 构造函数, 注意空格, 函数是没有空格的 %%%
    }

    Setter (self*) {
        Private attribute(){
            %%% x 是个数字, 默认是2, 但外部不能修改 %%%
        }
    }

    Getter (self*) {
        Public attribute(){
            %%% x 对 public 可见, 如果不写的话, 会沿用上面的Private %%%
        }
    }

    Operator (self*) {
        %%% 用于重载算符, 没有描述符 %%%
        print(self*::A){
            print(self.x)
        }
        plus(a*::String, self*){
            a + self.toStirng()
        }
    }

    f(x*) := x^2
    %%% 你可以定义自己的函数, 默认是 Public 的 %%%

}
```

用于生成对象, 对象的话是个函数闭包.

## Module

`using` 和 `Exposing` 用于管理模块, `As` 用于指定 `Alias`

## Literal

字面量

`k = 2 s` Let {k} {2 s}

`k =< 2 s`
Constant {k} {2 s}

`f(a, b) := a+b`

Function f {(a, b)} {return(a+b)}

## Comment

- 没有规定关键词必须大写开头, 也没有规定不能加下划线, 这只是官方统一写法

## Summary

宏关键词只有一个 (Macro), 其文法为:

- **Macro.Macro**
- **Macro.Statement**
- **Macro.Scope**

S=Keyword.Statement, P=Keyword.Scope

- 宏定义(Macro)

  - Macro + S + S + ... + S + P

大多数预定义关键词模式的文法都是:

- **Keyword.Macro**
- **Keyword.Statement**
- **Keyword.Auxiliary**
- **Keyword.Statement**
- **Keyword.Scope**

下面列出所有的关键词的宏模式:

S=Keyword.Statement, P=Keyword.Scope

<p hidden>

- 算符宏(Operate) 算符宏给出其 Lisp 表达式

  - Type S P
  - **(s::t)>>(:: s t)**
  - Type S P={S To S}
  - **(f::t=>t)>>(:: f t => t)**
  - Set S To S
  - **(f=s)>>(= f s)**
  - SetDelayed S P
  - **(f:=g)>>(:= f g)**
  - SetDelayed S P={S To S}
  - **(f(x\*):=x)>>(:= f x\* x)**
  - Lambda P={S To S}
  - **(lambda => expr)>>(=> lambda To expr)**
    </p>

- 模板宏(Template)

  - Template S S P
  - SubT P

- 类定义(Class)

  - class S P
  - class S Extents S P
  - Constructor S P
  - Setter S P
  - Getter S P
  - Operator S P
  - Public P
  - Private P
  - ~~Protect P~~
  - ~~Abstract P~~
  - ~~Static P~~
  - ~~Final P~~

- 载入宏(using)

  - using S
  - using S as S
  - using S With P={S as S, S as S}
  - using S All
  - using S Instance

- 导出宏(Exposing)

  - Exposing S
  - Exposing S as S
  - Exposing S With P={S as S, S as S}
