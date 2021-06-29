# SmartNotes
# Integrantes:
Julio González

Angel Zacarías
# Objetivo del proyecto

## Área de Participación: 
Educación

## Descripción:
Para este proyecto se tiene contemplado desarrollar un sitio web, que será de utilidad para estudiantes que desean tener una buena organización en lo relacionado a notas escolares, obtener herramientas para mejorar la concentración, aprender y hacer uso de técnicas para estudiar.

## Principales funcionalidades a desarrollar:
Las principales características propuestas:

- Un módulo para tomar tus notas: 

En este módulo pretendemos que puedas crear notas rápidas mientras tomas la clase y que puedan ser categorizadas por materia (ya sea que las des de alta, o que se puedan obtener en base al horario de ese semestre obteniéndolo de bases de datos de la UDG), un título o tema, o palabras clave. 

- Un módulo para hacer una lista (To Do) de tareas

En este módulo pretendemos que puedan ser categorizadas también, que puedan tener una fecha de alerta (con la cual enviar correos notificando que están cerca de ser alcanzadas).

- Un módulo para gestionar tu tiempo con la técnica Pomodoro

- Perfiles:

En conjunto con un buscador de compañeros, en donde los estudiantes que hagan uso de la plataforma puedan escribir un poco de ellos, su background, intereses académicos, formación extra y redes sociales o contactos. Esto con el propósito de que a pesar de estar en una época muy virtual, ofrecer una manera de hacer comunidad.

- Un módulo de estudio:

Este es el módulo más llamativo para nosotros, en el cual pretendemos que a través de un par de clics, poder generar una guía de estudio rápido de diferentes maneras:

1. Con base en las notas que has tomado.
2. Con base en tus notas y las de tus compañeros que lo autoricen a través de una solicitud (para formar un grupo de estudio).

Esto, a su vez en tal vez dos formatos diferentes:

1. Un “resumen” de las notas
2. Una serie de tarjetas de preguntas

-  Envío de mensajes:

Así como podrías ver el perfil de tus compañeros y enviarles solicitudes de grupo de estudio, creemos que sería buena idea desarrollar un servicio de mensajería instantánea.

## Otras funcionalidades deseadas:
- Dashboard con tu horario:

Poder crear (o obtener) el horario del estudiante para tenerlo visible en su inicio.

- Ligar a Classroom:

Esto pensado para obtener y sincronizar las tareas que sean programadas para una materia en classroom y que aparezcan en tu lista de tareas (To Do)


## Tecnologías utilizadas:
MERNG Stack el cual es un conjunto de frameworks como lo explica cada una de sus siglas:

- MongoDB 
- Express 
- React 
- NodeJs 
- GraphQL 

# Instrucciones de instalación
1. Tener instalado Visual Studio Code de preferencia:

<https://code.visualstudio.com/>

2. Es requerido para poder utilizar el sitio web, tener instalado **Nodejs** versión 12 o mayor.

https://nodejs.org/es/

3. Tener instalado **mongoDB** versión 4.0.0 o superior:

https://www.mongodb.com/try/download/community

4. Usar el SGBD de preferencia (Robo 3T recomendado aunque puede hacer uso de cualquier SGBD para mongoDB de su agrado, como el MongoDB Compass que viene por defecto al instalar mongoDB):

https://robomongo.org/

5. Una vez instalado mongoDB y su SGBD, añadir su **variable de entorno** de mongoDB que está en la ruta (ruta ejemplo): 

**C:\Program Files\MongoDB\Server\4.4\bin**

6. Iniciar su SGBD (Robo3T, por ejemplo), y abrir sus **opciones de conexión** para configurar la dirección (*localhost*) y el puerto a utilizar


7. Clonar el repositorio en una carpeta vacía de su preferencia:

<https://github.com/AngelZacarias/smart-notes.git>

8. Dirigirse a la carpeta (en terminal de cmd o bash) de **Server** donde se clonó el repositorio y ejecutar el comando:
    
    *npm install*

Este comando instalará los componentes y/o paquetes necesarios que quedarán en su carpeta *node_modules*

Al terminar, realizar lo mismo con la carpeta **Client**, dicha carpeta contiene el frontend del proyecto. Después, de igual forma se le instalarán los paquetes dentro de su carpeta *node_modules*

9. Ya que no es correcto dejar el archivo **.env** en el proyecto, se utilizó un archivo **.env.example** en donde se puede analizar qué variables de entorno se necesitan y qué posibles valores pueden tomar.

### Crear su archivo *.env* en la raíz de la carpeta **Server** y añadir sus variables de entorno explicadas en el *.env.example*

10. Usar el comando **npm start** tanto en la raíz de *Server* como en la raíz de *Client*, Con eso se abrirá una ventana en el navegador y **¡listo!** Puede comenzar a utilizar el proyecto.

El Server hace uso del **puerto: 5000** y el Client del **puerto: 3000**.
