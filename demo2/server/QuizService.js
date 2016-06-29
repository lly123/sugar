export class QuizService {
    constructor(room) {
        this.__sgId = "TableService";

        room.join(this, "quiz").then(talker => {
            talker.on("load").then(QuizService._load);
        });
    }

    static _load(message) {
        message.reply([
            {
                id: 1,
                question: "1+1=?"
            }
        ])
    }
}
