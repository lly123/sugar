export class QuizService {
    constructor(room) {
        this.__sgId = "TableService";

        room.join(this, "quiz").then(talker => {
            talker.on("load").then(QuizService.load);
            talker.on("create").then(QuizService.create);
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
        console.log('>>>>', message.data.question);

        message.reply({
            id: 999,
            question: message.data.question
        })
    }
}
