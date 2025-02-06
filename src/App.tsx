import { FC, useCallback, useEffect, useRef, useState } from "react";

import chuckImg from "./resources/img/chuck-norris.png";

import styles from "./App.module.scss";

type TJoke = {
  categories: string[];
  created_at: string;
  icon_url: string;
  id: string;
  updated_at: string;
  url: string;
  value: string;
};

const fetchJokes: () => Promise<TJoke[]> = async () => {
  try {
    const responses = await Promise.all(
      Array.from({ length: 3 }, () =>
        fetch("https://api.chucknorris.io/jokes/random").then((res) =>
          res.json()
        )
      )
    );

    return responses;
  } catch {
    return [];
  }
};

const App: FC = () => {
  const [jokes, setJokes] = useState<TJoke[]>([]);
  const [filter, setFilter] = useState("");
  const hasFetched = useRef<Boolean>(false);

  const loadRandomJokes = useCallback(async () => {
    const resJokes = await fetchJokes();

    setJokes(resJokes);
  }, []);

  const filteredJokes = jokes.filter((joke) =>
    joke.value.toLowerCase().includes(filter.toLowerCase())
  );

  useEffect(() => {
    !hasFetched.current && loadRandomJokes();
    hasFetched.current = true;
  }, [jokes.length]);

  return (
    <div className={styles.container}>
      <div className={styles.titleWrapper}>
        <h2>Chuck Norris Jokes</h2>
        <img src={chuckImg} alt="chuck norris head" />
      </div>
      <input
        onChange={(e) => setFilter(e.target.value)}
        value={filter}
        className={styles.searchInput}
        placeholder="Seach..."
        type="text"
      />
      {!!jokes.length ? (
        <table className={styles.jokesTable}>
          <thead>
            <tr>
              <th>#</th>
              <th>Joke</th>
            </tr>
          </thead>
          <tbody>
            {filteredJokes.map((joke, index) => (
              <tr key={joke.id}>
                <td>{index + 1}.</td>
                <td>{joke.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}
      {!filteredJokes.length && !!jokes.length ? (
        <div className={styles.emptyState}>Plaese, search other option...</div>
      ) : null}
    </div>
  );
};

export default App;
