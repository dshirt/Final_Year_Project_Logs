<!-- views/signup.ejs -->
<!doctype html>
<html>
<head>
<title>Node Authentication</title>
<link rel="stylesheet" href="fleetmanagement.css" type="text/css">
    <link rel="stylesheet" href="//netdna.bootstrapcdn.com/bootstrap/3.0.2/css/bootstrap.min.css"> <!-- load bootstrap css -->
<link rel="stylesheet" href="//netdna.bootstrapcdn.com/font-awesome/4.0.3/css/font-awesome.min.css"> <!-- load fontawesome -->
<style>
body 		{ padding-top:80px; }
</style>
</head>
<body>
<div class="container">

    <div class="col-sm-3 col-sm-offset-5">

    <h1 style="color: aqua"><span class="fa fa-sign-in"></span> Register</h1>
<!-- LOGIN FORM -->
<form action="/post-signup" method="post">
    <div class="form-group">
    <label style="color: aqua">Username</label>
    <input type="username" class="form-control" name="username" >
    </div>
    <div class="form-group">
    <label style="color: aqua; border-color: aqua;">Password</label>
    <input type="password" class="form-control" name="password">
    </div>

    <input type="submit" class="btn btn-success btn-lg" value="Register">
    </form>

    <hr>

    <p style="color: antiquewhite">Already have an account? <a href="/login">Login</a></p>
<p style="color: antiquewhite">Or go <a href="/">home</a>.</p>

</div>

</div>
</body>
</html>