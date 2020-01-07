
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<body>
<%@ page import = "java.sql.*,java.util.*" %>
<%
    String user = request.getParameter("userName");
    System.out.println(user);
    String userPassword = request.getParameter("userPassword");

    Class.forName("com.mysql.cj.jdbc.Driver");
    Connection connection = DriverManager.getConnection(
            "jdbc:mysql://localhost:3306/fleetlogin", "root", "root");
    PreparedStatement passWordCheck = connection.prepareStatement("SELECT userName, userPassword FROM loginDetails WHERE userName = ?");

    passWordCheck.setString(1,user);
    ResultSet resultSet = passWordCheck.executeQuery();

    if(!resultSet.next()){
        System.out.println("No User");
        passWordCheck.close();
    }else {
        System.out.println(resultSet.getString(2));
        System.out.println(userPassword);
        if (userPassword.equals(resultSet.getString(2)) ) {
            System.out.println("Its a Match");
        } else {
            System.out.println("Incorrect details");
        }
    }
%>
</body>
</html>
