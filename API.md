## Classes

<dl>
<dt><a href="#HTTPTimeoutError">HTTPTimeoutError</a> ⇐ <code>Error</code></dt>
<dd><p>Error for HTTP requests timing out</p>
</dd>
<dt><a href="#TransportError">TransportError</a> ⇐ <code>Error</code></dt>
<dd><p>Error for wrapping all failures for message transport across the wire</p>
</dd>
<dt><a href="#HOSError">HOSError</a> ⇐ <code>Error</code></dt>
<dd><p>Error for wrapping all failures of the HTTP request</p>
</dd>
<dt><a href="#HOSErrorResponse">HOSErrorResponse</a></dt>
<dd><p>Class for serializing HOSErrors over the wire, preserving stack trace</p>
</dd>
<dt><a href="#Transport">Transport</a></dt>
<dd><p>Base class for types of message transport over the wire</p>
</dd>
<dt><a href="#SockhopTransport">SockhopTransport</a> ⇐ <code><a href="#Transport">Transport</a></code></dt>
<dd><p>Transport wraper for a sockhop connection</p>
</dd>
<dt><a href="#HOSClient">HOSClient</a> ⇐ <code>Function</code></dt>
<dd><p>A client object for trunking an HTTP request to a server</p>
<pre><code class="language-js">// Example using sockhop
// Create an instance
const client = HOSClient.sockhop(sockhop_client_or_session);

// Call me like a function
const response = await client(&quot;www.google.com&quot;);

// Or if you prefer using the member function directly:
const response = await client.call(&quot;www.google.com&quot;);
</code></pre>
</dd>
<dt><a href="#HOSRequest">HOSRequest</a></dt>
<dd><p>Wrapper class for the HTTP request trunked over the wire</p>
</dd>
<dt><a href="#HOSResponse">HOSResponse</a></dt>
<dd><p>Wrapper class for the HTTP response trunked over the wire</p>
</dd>
<dt><a href="#HOSServer">HOSServer</a></dt>
<dd><p>Class for making HTTP request from HOSRequests, and return HOSResponse objects</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#HOSRequestObject">HOSRequestObject</a> : <code>object</code></dt>
<dd><p>Serializable HOSRequest</p>
</dd>
<dt><a href="#HOSResponseObject">HOSResponseObject</a> : <code>object</code></dt>
<dd><p>Serializable HOSResponse</p>
</dd>
</dl>

<a name="HTTPTimeoutError"></a>

## HTTPTimeoutError ⇐ <code>Error</code>
Error for HTTP requests timing out

**Kind**: global class  
**Extends**: <code>Error</code>  
<a name="TransportError"></a>

## TransportError ⇐ <code>Error</code>
Error for wrapping all failures for message transport across the wire

**Kind**: global class  
**Extends**: <code>Error</code>  
<a name="HOSError"></a>

## HOSError ⇐ <code>Error</code>
Error for wrapping all failures of the HTTP request

**Kind**: global class  
**Extends**: <code>Error</code>  
<a name="HOSErrorResponse"></a>

## HOSErrorResponse
Class for serializing HOSErrors over the wire, preserving stack trace

**Kind**: global class  
<a name="Transport"></a>

## Transport
Base class for types of message transport over the wire

**Kind**: global class  

* [Transport](#Transport)
    * [new Transport(connection)](#new_Transport_new)
    * [.connection](#Transport+connection) : <code>\*</code>
    * *[.request(req)](#Transport+request) ⇒ [<code>Promise.&lt;HOSResponse&gt;</code>](#HOSResponse)*

<a name="new_Transport_new"></a>

### new Transport(connection)
Constructor


| Param | Type | Description |
| --- | --- | --- |
| connection | <code>\*</code> | internal object used for transport |

<a name="Transport+connection"></a>

### transport.connection : <code>\*</code>
Connection

**Kind**: instance property of [<code>Transport</code>](#Transport)  
<a name="Transport+request"></a>

### *transport.request(req) ⇒ [<code>Promise.&lt;HOSResponse&gt;</code>](#HOSResponse)*
Request the server make a HTTP request and return results

**Kind**: instance abstract method of [<code>Transport</code>](#Transport)  
**Throws**:

- [<code>HOSError</code>](#HOSError) 
- [<code>TransportError</code>](#TransportError) 


| Param | Type |
| --- | --- |
| req | [<code>HOSRequest</code>](#HOSRequest) | 

<a name="SockhopTransport"></a>

## SockhopTransport ⇐ [<code>Transport</code>](#Transport)
Transport wraper for a sockhop connection

**Kind**: global class  
**Extends**: [<code>Transport</code>](#Transport)  

* [SockhopTransport](#SockhopTransport) ⇐ [<code>Transport</code>](#Transport)
    * [new SockhopTransport(connection, config)](#new_SockhopTransport_new)
    * [.connection](#Transport+connection) : <code>\*</code>
    * [.request(req)](#SockhopTransport+request) ⇒ [<code>Promise.&lt;HOSResponse&gt;</code>](#HOSResponse)

<a name="new_SockhopTransport_new"></a>

### new SockhopTransport(connection, config)
Constructor


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| connection | <code>SockhopClient</code> \| <code>SockhopSession</code> |  |  |
| config | <code>Object</code> |  |  |
| [config.timeout] | <code>number</code> | <code>30000</code> | Sockhop request timeout in ms |

<a name="Transport+connection"></a>

### sockhopTransport.connection : <code>\*</code>
Connection

**Kind**: instance property of [<code>SockhopTransport</code>](#SockhopTransport)  
**Overrides**: [<code>connection</code>](#Transport+connection)  
<a name="SockhopTransport+request"></a>

### sockhopTransport.request(req) ⇒ [<code>Promise.&lt;HOSResponse&gt;</code>](#HOSResponse)
Request the server make a HTTP request and return results

**Kind**: instance method of [<code>SockhopTransport</code>](#SockhopTransport)  
**Overrides**: [<code>request</code>](#Transport+request)  
**Throws**:

- [<code>HOSError</code>](#HOSError) 
- [<code>TransportError</code>](#TransportError) 


| Param | Type |
| --- | --- |
| req | [<code>HOSRequest</code>](#HOSRequest) | 

<a name="HOSClient"></a>

## HOSClient ⇐ <code>Function</code>
A client object for trunking an HTTP request to a server

```js
// Example using sockhop
// Create an instance
const client = HOSClient.sockhop(sockhop_client_or_session);

// Call me like a function
const response = await client("www.google.com");

// Or if you prefer using the member function directly:
const response = await client.call("www.google.com");
```

**Kind**: global class  
**Extends**: <code>Function</code>  

* [HOSClient](#HOSClient) ⇐ <code>Function</code>
    * [new HOSClient(transport)](#new_HOSClient_new)
    * _instance_
        * [.call(url, [options], [body])](#HOSClient+call) ⇒ [<code>Promise.&lt;HOSRequest&gt;</code>](#HOSRequest)
    * _static_
        * [.sockhop(sockhop, [options])](#HOSClient.sockhop) ⇒ [<code>HOSClient</code>](#HOSClient)

<a name="new_HOSClient_new"></a>

### new HOSClient(transport)
Constructor


| Param | Type |
| --- | --- |
| transport | [<code>Transport</code>](#Transport) | 

<a name="HOSClient+call"></a>

### hosClient.call(url, [options], [body]) ⇒ [<code>Promise.&lt;HOSRequest&gt;</code>](#HOSRequest)
Make an HTTP request over the wire

**Kind**: instance method of [<code>HOSClient</code>](#HOSClient)  
**Throws**:

- <code>TypeError</code> - If URL is invalid
- [<code>TransportError</code>](#TransportError) - If there is an error with trunking message across the wire
- [<code>HOSError</code>](#HOSError) - If there is an error on the server while making this request


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| url | <code>String</code> \| <code>URL</code> |  | URL of the request |
| [options] | <code>Object</code> | <code>{}</code> | options passed to the `http.request(...)` call made on the server. |
| [options.method] | <code>String</code> | <code>&#x27;GET&#x27;</code> |  |
| [options.headers] | <code>Object</code> |  |  |
| [body] | <code>undefined</code> \| <code>String</code> \| <code>Buffer</code> |  | Body to include with the request, not the server does not do any post-processing of this data, so you must stringify yourself. |

<a name="HOSClient.sockhop"></a>

### HOSClient.sockhop(sockhop, [options]) ⇒ [<code>HOSClient</code>](#HOSClient)
Create an instance from a Sockhop connection

**Kind**: static method of [<code>HOSClient</code>](#HOSClient)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| sockhop | <code>SockhopClient</code> \| <code>SockhopSession</code> |  | an existing sockhop connection |
| [options] | <code>Object</code> | <code>{}</code> | Options to pass to the SockhopTransport object |

<a name="HOSRequest"></a>

## HOSRequest
Wrapper class for the HTTP request trunked over the wire

**Kind**: global class  

* [HOSRequest](#HOSRequest)
    * [new HOSRequest()](#new_HOSRequest_new)
    * _instance_
        * [.toJSON()](#HOSRequest+toJSON) ⇒ [<code>HOSRequestObject</code>](#HOSRequestObject)
    * _static_
        * [.parse()](#HOSRequest.parse) ⇒ [<code>HOSRequest</code>](#HOSRequest)
        * [.new(url, options, body)](#HOSRequest.new) ⇒ [<code>HOSRequest</code>](#HOSRequest)

<a name="new_HOSRequest_new"></a>

### new HOSRequest()
Constructor


| Param | Type |
| --- | --- |
|  | [<code>HOSRequestObject</code>](#HOSRequestObject) | 

<a name="HOSRequest+toJSON"></a>

### hosRequest.toJSON() ⇒ [<code>HOSRequestObject</code>](#HOSRequestObject)
Serialize this request

**Kind**: instance method of [<code>HOSRequest</code>](#HOSRequest)  
<a name="HOSRequest.parse"></a>

### HOSRequest.parse() ⇒ [<code>HOSRequest</code>](#HOSRequest)
Parse a response (on the server) sent by the client

**Kind**: static method of [<code>HOSRequest</code>](#HOSRequest)  
**Throws**:

- <code>TypeError</code> - If URL is invalid


| Param | Type |
| --- | --- |
|  | [<code>HOSRequestObject</code>](#HOSRequestObject) | 

<a name="HOSRequest.new"></a>

### HOSRequest.new(url, options, body) ⇒ [<code>HOSRequest</code>](#HOSRequest)
Create a new request (on the client)

**Kind**: static method of [<code>HOSRequest</code>](#HOSRequest)  

| Param | Type |
| --- | --- |
| url | <code>String</code> | 
| options | <code>Object</code> | 
| body | <code>undefined</code> \| <code>String</code> \| <code>Buffer</code> | 

<a name="HOSResponse"></a>

## HOSResponse
Wrapper class for the HTTP response trunked over the wire

**Kind**: global class  

* [HOSResponse](#HOSResponse)
    * [new HOSResponse()](#new_HOSResponse_new)
    * _instance_
        * [.statusCode](#HOSResponse+statusCode) : <code>Number</code>
        * [.statusMessage](#HOSResponse+statusMessage) : <code>String</code>
        * [.headers](#HOSResponse+headers) : <code>object</code>
        * [.complete](#HOSResponse+complete) : <code>Boolean</code>
        * [.body](#HOSResponse+body) : <code>undefined</code> \| <code>String</code> \| <code>Buffer</code>
        * [.ok](#HOSResponse+ok) : <code>Boolean</code>
    * _static_
        * [.new(obj)](#HOSResponse.new)
        * [.parse(obj)](#HOSResponse.parse)

<a name="new_HOSResponse_new"></a>

### new HOSResponse()
Constructor


| Param | Type |
| --- | --- |
|  | [<code>HOSResponseObject</code>](#HOSResponseObject) | 

<a name="HOSResponse+statusCode"></a>

### hosResponse.statusCode : <code>Number</code>
HTTP Response status code

**Kind**: instance property of [<code>HOSResponse</code>](#HOSResponse)  
<a name="HOSResponse+statusMessage"></a>

### hosResponse.statusMessage : <code>String</code>
Standard HTTP Response status message (for code)

**Kind**: instance property of [<code>HOSResponse</code>](#HOSResponse)  
<a name="HOSResponse+headers"></a>

### hosResponse.headers : <code>object</code>
HTTP Response headers

**Kind**: instance property of [<code>HOSResponse</code>](#HOSResponse)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| "content-type" | <code>String</code> | The body's response type (e.g. "application/json") |

<a name="HOSResponse+complete"></a>

### hosResponse.complete : <code>Boolean</code>
Was the HTTP Response's body completely recieved by the server?

**Kind**: instance property of [<code>HOSResponse</code>](#HOSResponse)  
<a name="HOSResponse+body"></a>

### hosResponse.body : <code>undefined</code> \| <code>String</code> \| <code>Buffer</code>
HTTP response body

**Kind**: instance property of [<code>HOSResponse</code>](#HOSResponse)  
<a name="HOSResponse+ok"></a>

### hosResponse.ok : <code>Boolean</code>
Was the HTTP response of 200-century?

**Kind**: instance property of [<code>HOSResponse</code>](#HOSResponse)  
<a name="HOSResponse.new"></a>

### HOSResponse.new(obj)
Create a new object (on the server)

**Kind**: static method of [<code>HOSResponse</code>](#HOSResponse)  

| Param | Type |
| --- | --- |
| obj | [<code>HOSResponseObject</code>](#HOSResponseObject) | 

<a name="HOSResponse.parse"></a>

### HOSResponse.parse(obj)
Deserialize object (on the client)

**Kind**: static method of [<code>HOSResponse</code>](#HOSResponse)  

| Param | Type |
| --- | --- |
| obj | [<code>HOSResponseObject</code>](#HOSResponseObject) | 

<a name="HOSServer"></a>

## HOSServer
Class for making HTTP request from HOSRequests, and return HOSResponse objects

**Kind**: global class  

* [HOSServer](#HOSServer)
    * [new HOSServer([config])](#new_HOSServer_new)
    * [.handle(obj, cb)](#HOSServer+handle)

<a name="new_HOSServer_new"></a>

### new HOSServer([config])
Constructor


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [config] | <code>Object</code> | <code>{}</code> |  |
| [config.timeout] | <code>number</code> | <code>10000</code> | milliseconds to wait for HTTP response before timing out |
| [config.resopnse_encoding] | <code>String</code> | <code>&quot;utf-8&quot;</code> | encoding of HTTP response body |

<a name="HOSServer+handle"></a>

### hosServer.handle(obj, cb)
Handle a request

**Kind**: instance method of [<code>HOSServer</code>](#HOSServer)  

| Param | Type | Description |
| --- | --- | --- |
| obj | [<code>HOSRequestObject</code>](#HOSRequestObject) |  |
| cb | <code>function</code> | callback function to handle response: expects signature: `(HOSResponse) => {}` |

<a name="HOSRequestObject"></a>

## HOSRequestObject : <code>object</code>
Serializable HOSRequest

**Kind**: global typedef  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| url | <code>String</code> |  | normalized URL string |
| [options] | <code>Object</code> | <code>{}</code> | options passed to the `http.request(...)` call made here on the server. |
| [options.method] | <code>String</code> | <code>&#x27;GET&#x27;</code> |  |
| [options.headers] | <code>Object</code> | <code>{}</code> |  |
| [body] | <code>undefined</code> \| <code>String</code> \| <code>Buffer</code> |  | Body to include with the request, not the server does not do any post-processing of this data, so you must stringify yourself. |

<a name="HOSResponseObject"></a>

## HOSResponseObject : <code>object</code>
Serializable HOSResponse

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| statusCode | <code>number</code> | HTTP Response status code |
| statusMessage | <code>string</code> | Standard response message (for response code) |
| headers | <code>Object</code> | HTTP Response headers |
| headers["content-type" | <code>String</code> | The body's response type (e.g. "application/json") |
| complete | <code>Boolean</code> | Was all data of HTTP response received by server? |
| [body] | <code>undefined</code> \| <code>String</code> \| <code>Buffer</code> | Response body, type depends on the encoding type used by server |

