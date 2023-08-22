const AWS = require('aws-sdk');
const middy = require('@middy/core');
const jsonBodyParser = require('@middy/http-json-body-parser');

const sns = new AWS.SNS();
const ssm = new AWS.SSM();
const parameterName = '/mi-aplicacion/TopicArn';

const publish = async (event, context) => {
    try {
        const resp = await ssm.getParameter({ Name: parameterName }).promise();
        const variableValue = resp.Parameter.Value;

        const params = {
            Message: event.body.message,
            TopicArn: variableValue
        };

        const publishResult = await sns.publish(params).promise();

        const response = {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Headers" : "*",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "*"
            },
            body: JSON.stringify({ 
                message: 'Mensaje publicado exitosamente', 
                messageId: publishResult.MessageId 
            })
        };
        return response;

    } catch (error) {
        console.log(error);

        const response = {
            statusCode: 500,
            body: JSON.stringify({ 
                message: 'Error al procesar la solicitud' 
            })
        };
        return response;

    }
};

const subscribe = async (event, context) => {
    try {
        const resp = await ssm.getParameter({ Name: parameterName }).promise();
        const variableValue = resp.Parameter.Value;

        const params = {
            Protocol: 'email',
            // Protocol: 'SMS',
            TopicArn: variableValue,
            Endpoint: event.body.email
        };

        await sns.subscribe(params).promise();

        const response = {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Headers" : "*",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "*"
            },
            body: JSON.stringify({ 
                message: 'Subscripción exitosa'
            })
        };
        return response;

    } catch (error) {
        console.log(error);
        const response = {
            statusCode: 500,
            body: JSON.stringify({ 
                message: 'Error al procesar la solicitud' 
            })
        };
        return response;

    }
};

// no tengo los permisos para ejecutar esta funcion
const unsubscribe = async (event, context) => {
    try {
        const params = {
            SubscriptionArn: event.body.subscriptionArn
        };

        await sns.unsubscribe(params).promise();

        const response = {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Unsubscripción exitosa'
            })
        };
        return response;

    } catch (error) {
        console.log(error);

        const response = {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Error al procesar la solicitud'
            })
        };
        return response;

    }
};

// no tengo los permisos para ejecutar esta funcion
const statusInSns = async (event, context) => {
    try {        
        const params = {
            SubscriptionArn: event.body.subscriptionArn
        };

        const subscriptionAttributes = await sns.getSubscriptionAttributes(params).promise();

        const response = {
            statusCode: 200,
            body: JSON.stringify(subscriptionAttributes)
        };
        return response;
    
    } catch (error) {
        console.log(error);

        const response = {
            statusCode: 500,
            body: JSON.stringify({ 
                message: 'Error al procesar la solicitud' 
            })
        };
        return response;

    }
};

module.exports = {
    publish: middy(publish).use(jsonBodyParser()),
    subscribe: middy(subscribe).use(jsonBodyParser()),
    unsubscribe: middy(unsubscribe).use(jsonBodyParser()),
    statusInSns: middy(statusInSns).use(jsonBodyParser()),
}