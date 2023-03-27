const Router = require('express');
const router = new Router();
const {check} = require('express-validator');

const ticketController = require('../controllers/ticketController');

/**
 *  @swagger
 * components:
 *  schemas:
 *      Ticket:
 *          type: object
 *          required:
 *              - nameDoctor
 *              - dateMeeting
 *              - timeMeetingHours
 *              - timeMeetingMinutes
 *              - address
 *              - email
 *          properties:
 *              nameDoctor:
 *                  type: string
 *                  description: ФИО доктора
 *              dateMeeting:
 *                  type: string
 *                  description: День когда назначен визит в формате yyyy-mm-dd
 *              timeMeetingHours:
 *                  type: number
 *                  description: Во сколько часов назначен визит
 *              timeMeetingMinutes:
 *                  type: number
 *                  description: Во сколько минут назначен визит
 *              address:
 *                  type: string
 *                  description: Адрес клиники
 *              email:
 *                  type: string
 *                  description: Ваш email, на который прийдёт напоминание
 *          example:
 *                  nameDoctor: Иванов Иван Иванович
 *                  dateMeeting: 2023-03-30
 *                  timeMeetingHours: 10
 *                  timeMeetingMinutes: 30
 *                  address: Москва, Никольская, 12, оф. 401
 *                  email: test@test.ru
 */

/**
 * @swagger
 * tags:
 *  name: Tickets
 *  description: The tickets managing API
 */

/**
 * @swagger
 * /api/tickets:
 *  post:
 *      summary: Создать запись к доктору
 *      tags: [Tickets]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Ticket'
 *      responses:
 *          200:
 *              description: Запись успешно создана
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Ticket'
 *          500:
 *              description: Some server errors
 */

router.post('/', [
    check('nameDoctor', 'Введите ФИО доктора').not().isEmpty(),
    check('dateMeeting', 'Введите дату визита').not().isEmpty(),
    check('timeMeetingHours', 'Введите час визита').not().isEmpty(),
    check('timeMeetingMinutes', 'Введите минуты визита').not().isEmpty(),
    check('address', 'Введите адрес клиники').not().isEmpty(),
    check('email', 'Введите свой email для получения уведомлений').not().isEmpty(),
    check('dateMeeting', 'Неверный формат даты. Пример даты: yyyy-mm-dd').isISO8601(),
    check('timeMeetingHours', 'Приемное время с 8.00 до 20.00').isInt({min: 8, max: 20}),
    check('timeMeetingMinutes', 'Приемное время с 8.00 до 20.00').isInt({min: 0, max: 59}),
    check('email', 'Неверный email').isEmail(),
], ticketController.create);

module.exports = router;