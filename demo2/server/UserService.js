export class UserService {
    constructor(room) {
        this.__sgId = "UserService";

        room.join(this, "user").then(talker => {
            talker.on("newTeacher").then(UserService.newTeacher.bind(this, talker));
        });
    }

    static newTeacher(talker, message) {
        console.log('>>>#####', message);

        talker.say("joinedTeacher", {
            name: message.data
        })
    }
}
