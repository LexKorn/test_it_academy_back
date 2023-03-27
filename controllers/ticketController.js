const {validationResult} = require('express-validator');

const Ticket = require('../models/Ticket');
const mailService = require('../service/mail-service');

const addZero = (num) => {
    if (num < 10) {
        return num = '0' + num;
    } else {
        return num;
    }
};

class TicketController {

    async create(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({message: "Некорректные данные ввода", errors})
            }

            const { nameDoctor, dateMeeting, timeMeetingHours, timeMeetingMinutes, address, email} = req.body;
            const ticket = new Ticket({nameDoctor, dateMeeting, timeMeetingHours, timeMeetingMinutes, address, email});
            await ticket.save();

            const hour = 60 * 60 * 1000;
            const inOneDay = Date.now() + 24 * hour;
            const timerInOneDay = new Date(dateMeeting).getTime() - 3 * hour + timeMeetingHours * hour + timeMeetingMinutes * 60 * 1000 - inOneDay;
            const timerInHalfHour = new Date(dateMeeting).getTime() - 3 * hour + timeMeetingHours * hour + timeMeetingMinutes * 60 * 1000 - Date.now() - 1.5 * hour;

            const html = `
                <div>
                    <h2>
                        Вы записаны к доктору 
                        ${nameDoctor} 
                        на ${(new Date(dateMeeting)).toLocaleString('ru').substring(0, 10)} 
                        в ${addZero(timeMeetingHours)}:${addZero(timeMeetingMinutes)}.
                    </h2>
                    <h3>Клиника расположена по адресу: ${address}.</h3>
                    <h4>За 24ч и за 1,5ч до визита Вы получите оповещение на почту.</h4>
                </div>
            `;

            const htmlInOneDay = `
                <div>
                    <h2>
                        Вы записаны к доктору 
                        ${nameDoctor} 
                        на завтра ${(new Date(dateMeeting)).toLocaleString('ru').substring(0, 10)} 
                        в ${addZero(timeMeetingHours)}:${addZero(timeMeetingMinutes)}.
                    </h2>
                    <h3>Клиника расположена по адресу: ${address}.</h3>
                </div>
            `;

            const htmlInHalfHour = `
                <div>
                    <h2>
                        Вы записаны к доктору 
                        ${nameDoctor} 
                        сегодня в ${addZero(timeMeetingHours)}:${addZero(timeMeetingMinutes)}.
                    </h2>
                    <h3>Клиника расположена по адресу: ${address}.</h3>
                </div>
            `;

            const subject = 'Запись к доктору';
            const subjectInOneDay = 'Напоминание о записи к доктору за день';
            const subjectInHalfHour = 'Напоминание о записи к доктору за 1,5 часа';

            await mailService.sendNoticeMail(email, subject, html);

            if (timerInOneDay > 0) {
                setTimeout(() => {
                    mailService.sendNoticeMail(email, subjectInOneDay, htmlInOneDay);
                }, timerInOneDay);
            }           

            setTimeout(() => {
                mailService.sendNoticeMail(email, subjectInHalfHour, htmlInHalfHour);
            }, timerInHalfHour);

            return res.json({ticket});

        } catch(err) {
            res.status(500).json({message: 'Упс, что-то пошло не так при СОЗДАНИИ заявки...'});
        }
    }
};

module.exports = new TicketController();