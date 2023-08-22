const AWS = require('aws-sdk');

const getUsers = async (event) => {
  try {
    const dynamoDB = new AWS.DynamoDB.DocumentClient();
    const ssm = new AWS.SSM();
    const parameterName = '/mi-aplicacion/dataUser';
    const response = await ssm.getParameter({ Name: parameterName }).promise();
    const variableValue = response.Parameter.Value;

    const result = await dynamoDB.scan({
      TableName: variableValue
    }).promise();

    const users = result.Items;
    
    return{
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Headers" : "*",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "*"
      },
      body: JSON.stringify({
        message: 'Search success',
        users
      })
    }

  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getUsers,
}