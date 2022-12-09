<html>
    <head>
        <title>{{ title }}</title>
    </head>
    <body>
        <h1>Hi, nunjucks</h1>
        <p>{{ dogUrl }}</p>
        <h1>{{ title }}</h1>
        <img src="{{ dogUrl }}"/>
        <img src="{{ dogInfo.message }}"/>
        <div>{{ persons }}</div>
    </body>
</html>