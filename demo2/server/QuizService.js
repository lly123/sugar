export class QuizService {
    constructor(room) {
        this.__sgId = "QuizService";
        this.quiz_id = 1;

        room.join(this, "quiz").then(talker => {
            talker.on("load").then(QuizService.load.bind(this));
            talker.on("create").then(QuizService.create.bind(this, talker));
            talker.on("delete").then(QuizService.del.bind(this, talker));
            talker.on("answer").then(QuizService.answer.bind(this, talker));
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

    static create(talker, message) {
        talker.say("created", {
            id: ++this.quiz_id,
            question: message.data.question
        })
    }

    static del(talker, message) {
        talker.say("deleted", {
            id: message.data.quiz_id
        })
    }

    static answer(talker, message) {
        console.log('>>>', message)
    }
}
