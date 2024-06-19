# RpakaScriptの文法

RpakaScriptの文法は以下の構文規則に従います。

## プログラム(Program)

プログラムは0個以上の `statement` からなり、最後に `EOF` が来ます。

```peg
program = (statement )* "EOF"
```

## ステートメント(Stmt)

ステートメントには以下の種類があります。

- 式ステートメント
- if 文
- for 文
- 関数宣言
- 変数宣言
- 定数宣言
- ブロック

```peg
statement = expr_statement
           / if_statement
           / for_statement
           / fn_declaration
           / var_declaration
           / const_declaration
           / block
```

### 式ステートメント

式ステートメントは式に続いてセミコロン (`;`) が来ます。

```peg
expr_statement = expression ";"
```

### if 文

if 文は `if` キーワードに続いて条件式 (`grouping`)、本体 (`block`) が来ます。さらに `else` ブロックまたは `else if` が続く場合があります。

```peg
if_statement = "if" grouping block ("else" block/if_statement)?
```

### for 文

for 文は `for` キーワードに続いて、オプションで `for_grouping`、そして `break_block` が来ます。

```peg
for_statement = "for" for_grouping? break_block
```

### 関数宣言

関数宣言は `fn` キーワードに続いて、関数名、引数リスト、返り値ブロックが来ます。

```peg
fn_declaration = "fn" identifier "(" parameter_list? ")" return_block
```

### 変数宣言

変数宣言は `var` キーワードに続いて、代入式が来てセミコロンで終わります。

```peg
var_declaration = "var" assignment_expression_var_const ";"
```

## その他の構文規則

### パラメーターリスト

パラメーターリストは0個以上の識別子と式のペアからなります。

```peg
parameter_list = identifier ("," expression)*
```

### ブロック

ブロックは波カッコ (`{}`) で囲まれた0個以上のステートメントからなります。

```peg
block = "{" statement* "}"
```

### break ブロック

break ブロックは波カッコで囲まれた0個以上のステートメントと、オプションで `break` ステートメントからなります。

```peg
break_block = "{" statement* ("break" ";")? "}"
```

### 返り値ブロック

返り値ブロックは波カッコで囲まれた0個以上のステートメントと、オプションで式と `return` ステートメントからなります。

```peg
return_block = "{" statement* (expression)? ("return" ";")? "}"
```

### for グルーピング

for グルーピングは括弧で囲まれた for ステートメントです。

```peg
for_grouping = "(" for_stmt ")"
```

### 代入式

代入式は識別子と等号 (`=`)、式からなります。

```peg
assignment_expression = identifier "=" expression
```

### 変数・定数の代入式

変数・定数の代入式は識別子と、オプションで等号と式からなります。

```peg
assignment_expression_var_const = identifier ( "=" expression )?
```

## 式(Expr)

### 式

式には以下の種類があります。

- 論理和 (||)
- 代入式
- その他 (下記参照)

```peg
expression = logic_or / assignment_expression
```

### 論理和

論理和は論理積 (`&&`) で区切られた論理和項からなります。

```peg
logic_or  = logic_and ("||" logic_and)*
```

### 論理積

論理積は等価性検査 (`==`, `!=`) で区切られた論理積項からなります。

```peg
logic_and = equality ("&&" equality)*
```

### 等価性検査

等価性検査は比較式で区切られた等価性検査項からなります。

```peg
equality = comparison (("==" / "!=") comparison)*
```

### 比較式

比較式は加減式で区切られた比較項からなります。

```peg
comparison = addition ((">" / ">=" / "<" / "<=") addition)*
```

### 加減式

加減式は乗除剰余式で区切られた加減項からなります。

```peg
addition = multiplication (("+" / "-") multiplication)*
```

### 乗除剰余式

乗除剰余式は単項式で区切られた乗除剰余項からなります。

```peg
multiplication = unary (("*" / "/" / "%") unary)*
```

### 単項式

単項式は単項演算子 (`!`) と基本式からなります。

```peg
unary = ("!" unary) / primary
```

### 基本式

基本式には以下の種類があります。

- リテラル
- 識別子
- 配列リテラル
- 配列アクセス
- 関数呼び出し
- グルーピング

```peg
primary = literal
         / identifier
         / array_literal
         / array_access
         / function_call
         / grouping
```

### グルーピング

グルーピングは括弧で囲まれた式です。

```peg
grouping = "(" expression ")"
```

### 配列リテラル

配列リテラルは角括弧で囲まれた0個以上の式のリストです。

```peg
array_literal = "[" (expression ("," expression)*)? "]"
```

### 配列アクセス

配列アクセスは識別子と角括弧で囲まれたインデックス式からなります。

```peg
array_access = identifier "[" expression "]"
```

### 関数呼び出し

関数呼び出しは関数名と括弧で囲まれた0個以上の引数式のリストからなります。

```peg
function_call = identifier "(" (expression ("," expression)*)? ")"
```

### リテラル

リテラルには以下の種類があります。

- 数値
- 文字列リテラル
- 真理値リテラル
- `nil`

```peg
literal = number / string_literal / boolean_literal / "nil"
```

### 真理値リテラル

真理値リテラルは `true` または `false` です。

```peg
boolean_literal = "true" / "false"
```

### 数値

数値は0個以上の数字と、可読性を高めるためにアンダースコア(`_`)を数値の間に挟むことができます。
また、オプションでドット (`.`) と少数部からなります。

```peg
number = [0-9]+(_*[0-9]+)*("."[0-9]+(_[0-9]+)*)?
```

### 識別子

識別子は英字または アンダースコア (`_`) で始まり、英数字またはアンダースコアが続きます。

```peg
identifier = [a-zA-Z_] [a-zA-Z0-9_]*
```

### 文字列リテラル

文字列リテラルはダブルクォート (`"`)またはシングルクォート(`'`) で囲まれた0個以上の文字からなります。

```peg
string_literal = double_quoted_string / single_quoted_string

double_quoted_string = '"' quoted_chars '"'
single_quoted_string = "'" quoted_chars "'"
quoted_chars = (!"\"" .)*

```
