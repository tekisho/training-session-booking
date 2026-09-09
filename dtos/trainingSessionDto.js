class trainingSessionDto {
    constructor(personId, name, trainingDate, card) {
        this.personId = personId;
        this.name = name.trim();
        this.trainingDate = trainingDate;
        this.card = {
            number: card.number.trim(),
            expiryDate: card.expiryDate
        };
    }
}

module.exports = trainingSessionDto;