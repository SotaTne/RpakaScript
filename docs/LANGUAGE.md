# RpakaScriptの使い方

## 変数の定義について

```RpakaScript
var n = 23;
var b = 200 + n;
var c = "hello"
```

変数の定義は`var` `変数名` `=` `式` `;`を用いて行います。
RpakaScriptでは、文の終わりには`セミコロン`(`;`)が必要です

## 変数への代入について

```RpakaScript
var n = 1;
n = 100;
```

変数への代入は、`定義されている変数名` `=` `式` `;`で行うことができます。

また、変数への代入は式として扱われるので以下のような処理も可能です

```RpakaScript
var k = 10;
print(k=100);
//100
```

## 関数の定義について

```RpakaScript
fn printHello(){
  print("hello")
}
```

RpakaScriptでは関数を定義する際に

`fn` `関数名` `(` `定義する引数` `)` `{`

`実行する処理`

`}`
で行うことができます。
また、関数の中に限り`return`文を使用することができます。

## 関数の呼び出しについて

```RpakaScript
fn add(a,b){
  return a+b;
}

var n = add(1,2);
```

関数を呼び出す際は、`関数名` `(` `定義されている引数に対応する値` `)`
で呼び出すことが可能です。
この関数の呼び出しは`式`として扱われます。

## 繰り返し処理について

RpakaScriptでは、`for`文と`while`文を利用して繰り返し処理を書くことが可能です。

```RpakaScript
for(var i=0;i<10; i=i+1){
  print(i);
}
//0,1,2,...,9

var k = 1;
while(k<10){
  k = K*2;
  print(k);
}
//1,2,4,8

for(;;){
  print("hello");
}
//hello,hello,...

var z = 10;
for{
  z = z*z
  if(z>100000000){
    break;
  }
}

while{
  print("while")
}
```

RpakaScriptでは、`for`文は、`for` `(` `値の定義` `;` `実行する条件` `;` `毎回最後に行う式` `)` `文`
または、`for` `文` でずっと繰り返す処理を書くことができます。`while`でも同じことが可能です

`while`文は、`while` `(` `実行する条件` `)` `文` で書くことができます。
また、`while` `文`を利用することも可能です

`while`文と`for`文ないでは`break`を使用することが可能です
