export interface Methods {
    /**
     * The `GET` method requests a representation of the specified resource.
     * Requests using GET should only retrieve data.
     */
    GET: any;
    
    /**
     * The `HEAD` method asks for a response identical to a GET request, but
     * without the response body.
     */
    HEAD: any;
    
    /**
     * The `POST` method submits an entity to the specified resource, often
     * causing a change in state or side effects on the server.
     */
    POST: any;
    
    /**
     * The `PUT` method replaces all current representations of the target
     * resource with the request payload.
     */
    PUT: any;
    
    /**
     * The `DELETE` method deletes the specified resource.
     */
    DELETE: any;
    
    /**
     * The `CONNECT` method establishes a tunnel to the server identified
     * by the target resource.
     */
    CONNECT: any;
    
    /**
     * The `OPTIONS` method describes the communication options for the
     * target resource.
     */
    OPTIONS: any;
    
    /**
     * The `TRACE` method performs a message loop-back test along the
     * path to the target resource.
     */
    TRACE: any;
    
    /**
     * The `PATCH` method applies partial modifications to a resource.
     */
    PATCH: any;
}