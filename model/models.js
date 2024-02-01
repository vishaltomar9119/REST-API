module.exports = function (nosql){

nosql.model('Hospital' , new nosql.Schema({
    name: {
        type: String,
        required: true,
    }
}))

nosql.model('Psychiatrist', new nosql.Schema({
    name: {
            type: String,
            required: true,
          },
          hospitalId: {
              type: String ,
              required:true
            },
}));

nosql.model('Patient', new nosql.Schema({
         name: {
            type: String,
            required: true,
          },
          psychiatristId: {
            type: String, 
            default:null,
          },
          address: {
            type: String,
            default:null,
          },
          phone: {
            type: Number,
            required: true,
          },
          email: {
            type: String,
          },
          password: {
            type: String,
            required: true,
          },
          photo: {
            type: String,
            default: null
          },
}));


};




