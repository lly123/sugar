export class QuizService {
    constructor(room) {
        this.__sgId = "TableService";

        room.join(this, "quiz").then(talker => {
            talker.on("load").then(QuizService.load);
            talker.on("create").then(QuizService.create);
            talker.on("del").then(QuizService.del);
        });
    }

    static load(message) {
        message.reply([
            {
                id: 1,
                question: "1+1=?"
            }
        ])
    }

    static create(message) {
        message.reply({
            id: 999,
            question: message.data.question
        })
    }

    static del(message) {
        console.log('*****', message.data);

        message.reply(message.data.quiz_id)
    }
}
