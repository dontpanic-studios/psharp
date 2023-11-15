# 💡 PSharp 언어 아이디어 리스트

- ex) 로그 반환
```
// simple hello world

prtlog("Hello, World!");
```

- ex) 만약에
```
// then = if {}, or = else, or if = else if, not = -1

if this eq 10 
then prtlog("true");
or if prtlog("kinda true");
or not prtlog("false");
```

아니면
 
```
// ver 2
set this = 10;

if this eq 10 {
    prtlog("this shit is cool");
} or {
    prtlog("nahhhhh");
}
```