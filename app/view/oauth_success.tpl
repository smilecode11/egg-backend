<html>
    <head>
        <meta charset="utf-8"/>
        <title>授权成功</title>
        <meta name="description" content=""></meta>
        <meta name="viewport" content="width=device-width, initial-scale=1"></meta>
    </head>

    <body>
        <h1>授权成功</h1>
        <h3>2秒后关闭</h3>
    </body>
    <script>
        window.onload = function(){
            setTimeout(()=>{
                const message = {
                    type: 'oauth-token',
                    token: '{{token}}'
                }
                window.opener.postMessage(message, 'http://localhost:8080')
                window.close();
            },2000)
        }        
    </script>
</html>
