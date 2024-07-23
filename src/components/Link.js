import { AUTH_TOKEN } from "./constant";
import { timeDifferenceForDate } from "./util";
import { gql, useMutation } from "@apollo/client";
import { FEED_QUERY } from "./LinkList";

const VOTE_MUTATION = gql`
  mutation VoteMutation($linkId: ID!) {
    vote(linkId: $linkId) {
      id
      link {
        id
        votes {
          id
          user {
            id
          }
        }
      }
      user {
        id
      }
    }
  }
`;

const Link = (props) => {
  const { link } = props;
  const authToken = localStorage.getItem(AUTH_TOKEN);

  const [vote] = useMutation(VOTE_MUTATION, {
    variables: {
      linkId: link.id,
    },
    update: (cache, { data: { vote } }) => {
      // The update function is called after the mutation, receiving the Apollo cache and the mutation result.
      const { feed } = cache.readQuery({
        // reads the current state of the feed query from the cache.
        query: FEED_QUERY,
      });

      // It creates a new list of links, updating the votes for the specific link that was voted on.
      const updatedLinks = feed.links.map((feedLink) => {
        // If the link's ID matches the ID of the link that was voted on (link.id), it creates a new link object with the updated votes. The votes array is updated to include the new vote.
        if (feedLink.id === link.id) {
          return {
            ...feedLink,
            votes: [...feedLink.votes, vote],
          };
        }
        return feedLink;
      });

      // It writes the updated list back to the cache, ensuring the UI reflects the new state immediately without needing to refetch data from the server.
      cache.writeQuery({
        query: FEED_QUERY,
        data: {
          feed: {
            links: updatedLinks,
          },
        },
      });
    },
  });

  return (
    <div className="flex mt2 items-start">
      <div className="flex items-center">
        <span className="gray">{props.index + 1}.</span>
        {authToken && (
          <div
            className="ml1 gray f11"
            style={{ cursor: "pointer" }}
            onClick={vote}>
            ▲
          </div>
        )}
      </div>
      <div className="ml1">
        <div>
          {link.description} ({link.url})
        </div>
        {
          <div className="f6 lh-copy gray">
            {link.votes.length} {link.votes.length > 1 ? "votes" : "vote"} | by{" "}
            {link.postedBy ? link.postedBy.name : "Unknown"}
            {timeDifferenceForDate(link.createdAt)}
          </div>
        }
      </div>
    </div>
  );
};

export default Link;
