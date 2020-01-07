<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
  <head>
    <title>Fleet Management Login</title>
    <link href="fleetmanagement.css" rel="stylesheet" type="text/css">
    <body>
      <div class="loginbox">
      <img src="Images/avatar.jpg" class="avatar">
        <h1>Login Here</h1>
        <form method="put" action="checkLoginDetails.jsp">
          <label for="userName">Username</label>
          <input type="text" name="userName" placeholder="Enter Username">
          <label for="userPassword">Password</label>
          <input type="password" name="userPassword" placeholder="Enter password">
          <input type="submit" name="" value="Login">
        </form>

      </div>
    </body>
  </head>
</html>
