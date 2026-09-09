Layered application: router -> controller -> service -> model

**Router** - routes, calles Controller.
**Controler** - basic validation, calles Service (using DTO object as a parameter).
**Service** - complex validation, business logic, calles Model.
**Model** - interaction with the DB (Mongoose lib).