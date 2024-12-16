

//Configuración del Clúster de Sharding
//Iniciar los Servicios de MongoDB:
   //Inicia los servicios de MongoDB en diferentes puertos para simular un entorno de clúster.
     
     mongod --port 27017 --dbpath /data/db1 --replSet rs0 --shardsvr
     mongod --port 27018 --dbpath /data/db2 --replSet rs0 --shardsvr
     mongod --port 27019 --dbpath /data/db3 --replSet rs0 --shardsvr
    

//Configurar el ReplSet:
   //Conertarse a uno de los nodos y configura el conjunto de réplicas:
    
     rs.initiate()
     rs.add("localhost:27018")
     rs.add("localhost:27019")
   

//Iniciar el Config Server:
   //Inicia el servidor de configuración en un puerto diferente:
     
     mongod --configsvr --replSet csReplSet --port 27020 --dbpath /data/configdb
     

//Iniciar el Mongos Router:
   //Inicia el router Mongos para coordinar las operaciones de sharding:
     
     mongos --configdb csReplSet/localhost:27020 --port 27021
     

//Habilitar el Sharding en la Base de Datos
//Conectarse al Mongos Router:
   //Conéctate al router Mongos:
    
     mongo --port 27021
   

//Habilitar el Sharding en la Base de Datos:
 
   use admin
   db.runCommand({ enableSharding: "torneo_deportivo" })
  

//Crear Índices y Shardear la Colección
//Crear un Índice en el Campo `team_id`:
  
   use torneo_deportivo
   db.equipos.createIndex({ team_id: 1 })
 

//Shardear la Colección `equipos`:
  
   use admin
   db.runCommand({
     shardCollection: "torneo_deportivo.equipos",
     key: { team_id: 1 }
   })
 

//Agregar Shards al Clúster
//Agregar Shards al Clúster:
 
   sh.addShard("shard1/localhost:27017")
   sh.addShard("shard2/localhost:27018")
   sh.addShard("shard3/localhost:27019")
 

//Verificación y Pruebas
//Verificar el Estado del Sharding:
  
   sh.status()
  

//Insertar Datos de Prueba:
 //Inserta algunos datos de prueba para verificar que el sharding está funcionando correctamente:
     
     use torneo_deportivo
     db.equipos.insertMany([
       { team_id: 1, nombre: "Equipo A" },
       { team_id: 2, nombre: "Equipo B" },
       { team_id: 3, nombre: "Equipo C" }
     ])
     

//Realizar Consultas de Prueba**:
  //Realiza algunas consultas para asegurarte de que los datos se distribuyen correctamente entre los shards:
     
     db.equipos.find()
  

