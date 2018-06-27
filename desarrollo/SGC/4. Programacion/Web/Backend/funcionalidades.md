FUNCIONES DE LA APP

- CREAR COMPANY:
    - insertar en MAINUSER
    - insertar en COMPANY (id_user)

- CREAR PARKING:
    - insertar en MAINUSER
    - insertar en LOCATION
    - insertar en PARKING (id_location, id_user, id_company, opcional(id_employee))

- LOGIN COMO COMPANY:
    - select de MAINUSER join con COMPANY

- LOGIN COMO PARKING:
    - select de MAINUSER join con PARKING

- OBTENER PARKINGS CERCANOS A UNAS COORDENADAS
    - ENVIAR LAT, LNG POR URL

- CREAR EMPLEADO POR EMPRESA:
    - insert de EMPLOYEE (id_company, opcional(id_parking))

