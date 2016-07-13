export class QuizService {
    constructor(room) {
        this.__sgId = "TableService";
        this.quiz_id = 1;

        room.join(this, "quiz").then(talker => {
            talker.on("load").then(QuizService.load.bind(this));
            talker.on("create").then(QuizService.create.bind(this));
            talker.on("del").then(QuizService.del);
        });
    }

    static load(message) {
        message.reply([
            {
                id: this.quiz_id,
                question: "1+1=?"
            }
        ])
    }

    static create(message) {
        message.reply({
            id: this.quiz_id++,
            question: message.data.question
        })
    }

    static del(message) {
        message.reply(message.data.quiz_id)
    }
}
