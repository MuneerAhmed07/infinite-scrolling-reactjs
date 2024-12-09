import { useState, useEffect } from "react";
import axios from "axios";

const InfiniteScroll = () => {

    const [data, setData] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    console.log(data);

    const fetchData = async () => {
        if (!hasMore) return;

        setLoading(true);
        try {
          const response = await axios.get(
            `https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=10`
          );
          if (response.data.length === 0) {
            setHasMore(false);
          } else {
            setData((prevData) => [...prevData, ...response.data]);
            setPage((prevPage) => prevPage + 1);
          }
        } catch (error) {
          console.error("Failed to fetch data:", error);
        } finally {
          setLoading(false);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    const handleScroll = () => {
        const {scrollTop, scrollHeight, clientHeight} = document.documentElement;
        if (scrollTop + clientHeight >= scrollHeight - 10 && !loading) {
            fetchData()
        }
    }

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [loading]);

  return (
    <>
     <div className="infinite-scroll-container">
        <ul>
            {
                data.map((item) => (
                    <li key={item.id} className="post">
                        <h3>{item.title}</h3>
                        <p>{item.body}</p>
                    </li>
                ))
            }
        </ul>
        {loading && <p className="loading">Loading Data...</p>}
        {!hasMore && <p className="no-more-data">No more Data</p>}
    </div> 
    </>
  )
}

export default InfiniteScroll;
