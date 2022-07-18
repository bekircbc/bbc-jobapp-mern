export const PageJobSources = () => {
  return (
    <>
      <p>This is the Job Sources page.</p>
      <p>There are {jobSources.length} job sources:</p>
      <ul>
        {jobSources.map((jobSource, i) => {
          return <li key={i}>{jobSource.name}</li>;
        })}
      </ul>
    </>
  );
};
