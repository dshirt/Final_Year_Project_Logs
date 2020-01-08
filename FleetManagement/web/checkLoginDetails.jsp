
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
    <title>Check Log in details</title>
        <link href="fleetmanagement.css" rel="stylesheet" type="text/css">
    <body>
    <%@ page import = "java.sql.*,java.util.*" %>
    <%
        String user = request.getParameter("userName");
        String userPassword = request.getParameter("userPassword");

        Class.forName("com.mysql.cj.jdbc.Driver");
        Connection connection = DriverManager.getConnection(
                "jdbc:mysql://localhost:3306/fleetlogin", "root", "root");
        PreparedStatement passWordCheck = connection.prepareStatement("SELECT userName, userPassword FROM loginDetails WHERE userName = ?");

        passWordCheck.setString(1,user);
        ResultSet resultSet = passWordCheck.executeQuery();

        if(!resultSet.next()){
            response.sendRedirect("http://localhost:8080/FleetManagement_war_exploded/unsuccessfulLogin.jsp");
            passWordCheck.close();
        }else {
            if (userPassword.equals(resultSet.getString(2)) ) {
                response.sendRedirect("http://localhost:8080/FleetManagement_war_exploded/fleetManager.jsp");
            } else {
                response.sendRedirect("http://localhost:8080/FleetManagement_war_exploded/unsuccessfulLogin.jsp");
            }
        }
    %>
    </body>
</html>
