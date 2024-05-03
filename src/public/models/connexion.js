const mongoose = require('mongoose')
const connexionSchema = mongoose.Schema({
    ip: String,
    channel_id: String,
    email: String,
    password: String,
    create_time: Number
})

connexionSchema.statics.getAll = async function () {
    const connexions = await Connexion.find();
    return Array.isArray(connexions) ? connexions : [connexions];
}

connexionSchema.statics.create = async (ip, channel_id) => {
    const newConnexion = new Connexion({
        ip,
        channel_id,
        create_time: Date.now()
    }).save()
    return newConnexion
}

connexionSchema.statics.delete = async (ip) => {
    const deleteConnexion = await Connexion.findOneAndDelete({ ip })
    return deleteConnexion
}

connexionSchema.statics.getConnexionByIp = async (ip) => {
    let findConnexion = await Connexion.findOne({ ip })
    if (findConnexion) return findConnexion
    else return false
}

const Connexion = mongoose.model('connexion', connexionSchema)

module.exports = Connexion