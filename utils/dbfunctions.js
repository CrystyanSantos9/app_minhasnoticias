const User = require("../models/user")

const createInitialUser = async() => {
    const total = await User.count({ username: 'root'})
    if(total === 0){
        const user1 = new User({
            username: 'root',
            password: '12345',
            roles: ['admin', 'restrito']
        })
        const user2 = new User({
            username: 'restrito',
            password: '12345',
            roles: ['restrito']
        })
        await user1.save()
        await user2.save()
    }
}

const removeAll = async()=>{
    const removed = await User.deleteMany({})
    console.log(removed)
}


const show = async () => {
    const val =  await User.find({})
    console.log(val)
}


module.exports = {
    createInitialUser,
    removeAll,
    show
}