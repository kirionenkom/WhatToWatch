import { MORE_LIKE_FILMS_COUNT } from '../../const.ts';
import { Link, useParams } from 'react-router-dom';
import Tabs from '../../components/tabs/tabs.tsx';
import MoviesList from '../../components/movies-list/movies-list.tsx';
import Logo from '../../components/logo/logo.tsx';
import Footer from '../../components/footer/footer.tsx';
import UserBlock from '../../components/user-block/user-block.tsx';
import { useAppDispatch, useAppSelector } from '../../redux/hooks.ts';
import { useEffect } from 'react';
import { fetchFilmDataAction } from '../../redux/api-actions.ts';
import MyListButton from '../../components/my-list-button/my-list-button.tsx';
import { getAuthorized } from '../../redux/user-slice/selectors.ts';
import { getFilmCard, getMoreLikeThis } from '../../redux/films-slice/selectors.ts';
import { Helmet } from 'react-helmet-async';

export default function MoviePage() {
  const { id } = useParams();
  const dispatch = useAppDispatch();

  const authorized = useAppSelector(getAuthorized);
  const filmCard = useAppSelector(getFilmCard);
  const moreLikeThis = useAppSelector(getMoreLikeThis);

  useEffect(() => {
    if (id && id !== filmCard?.id) {
      dispatch(fetchFilmDataAction(id));
    }
  }, [dispatch, id, filmCard?.id]);

  if (!filmCard) {
    return null;
  }

  return (
    <>
      <section className="film-card film-card--full">
        <Helmet>
          <title>{filmCard.name}</title>
        </Helmet>
        <div className="film-card__hero">
          <div className="film-card__bg">
            <img src={filmCard.backgroundImage} alt={filmCard.name} />
          </div>

          <h1 className="visually-hidden">WTW</h1>

          <header className="page-header film-card__head">
            <Logo />

            <UserBlock />
          </header>

          <div className="film-card__wrap">
            <div className="film-card__desc">
              <h2 className="film-card__title">{filmCard.name}</h2>
              <p className="film-card__meta">
                <span className="film-card__genre">{filmCard.genre}</span>
                <span className="film-card__year">{filmCard.released}</span>
              </p>

              <div className="film-card__buttons">
                <Link
                  to={`/player/${filmCard.id}`}
                  className="btn btn--play film-card__button"
                  type="button"
                >
                  <svg viewBox="0 0 19 19" width="19" height="19">
                    <use xlinkHref="#play-s"></use>
                  </svg>
                  <span>Play</span>
                </Link>
                {authorized && (
                  <>
                    <MyListButton filmCard={filmCard} />
                    <Link to={'review'} className="btn film-card__button">
                      Add review
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="film-card__wrap film-card__translate-top">
          <div className="film-card__info">
            <div className="film-card__poster film-card__poster--big">
              <img src={filmCard.posterImage} alt={filmCard.name} width="218" height="327" />
            </div>

            <Tabs filmCard={filmCard} />
          </div>
        </div>
      </section>

      <div className="page-content">
        {moreLikeThis.length !== 0 && (
          <section className="catalog catalog--like-this">
            <h2 className="catalog__title">More like this</h2>
            <MoviesList films={moreLikeThis} filmsCount={MORE_LIKE_FILMS_COUNT} />
          </section>
        )}

        <Footer />
      </div>
    </>
  );
}
