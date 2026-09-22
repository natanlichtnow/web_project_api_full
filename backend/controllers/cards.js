const Card = require('../models/card');

const {
  BadRequestError,
  NotFoundError,
  ForbiddenError,
} = require('../errors');

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.json(cards))
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({
    name,
    link,
    owner: req.user._id,
  })
    .then((card) => res.status(201).json(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Dados invÃ¡lidos para criar cartÃ£o'));
      }
      return next(err);
    });
};

const deleteCard = (req, res, next) => {
  const { cardId } = req.params;

  Card.findById(cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('CartÃ£o nÃ£o encontrado');
      }

      if (card.owner.toString() !== req.user._id) {
        throw new ForbiddenError('VocÃª nÃ£o pode remover cartÃµes de outros usuÃ¡rios');
      }

      return Card.findByIdAndDelete(cardId)
        .then(() => {
          res.json({
            message: 'CartÃ£o removido com sucesso',
          });
        });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('ID de cartÃ£o invÃ¡lido'));
      }
      return next(err);
    });
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    {
      $addToSet: {
        likes: req.user._id,
      },
    },
    {
      new: true,
    },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('CartÃ£o nÃ£o encontrado');
      }
      return res.json(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('ID de cartÃ£o invÃ¡lido'));
      }
      return next(err);
    });
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    {
      $pull: {
        likes: req.user._id,
      },
    },
    {
      new: true,
    },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('CartÃ£o nÃ£o encontrado');
      }
      return res.json(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('ID de cartÃ£o invÃ¡lido'));
      }
      return next(err);
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
