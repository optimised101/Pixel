const formData = new FormData();
formData.append("file", blob);
console.log(formData.get("file"));
fetch("https://api.nft.storage/upload", {
  method: "POST",
  body: formData,
  headers: {
    Accept: "application/json",
    Authorization:
      "Bearer WyIweDQ5NTFiOGFiMWNlMDY4NDdkNzY0ZWY1ODlmNWNmMzg2ODc0MGZmOGY4MDkyZDUzYjIzMDkzN2ZlZGJlYmYxMTUwNGY1NDNkYjNkNzEzZGNkYjBkNjQyMmViZjAyMzQ5OTQ3NGYyZjQ5OTQ0ZjJhYjRiNWMxYTFlMzBkZWYwNWM4MWMiLCJ7XCJpYXRcIjoxNjY0MDM3MTkwLFwiZXh0XCI6MTY2NDA0NDM5MCxcImlzc1wiOlwiZGlkOmV0aHI6MHhEOTkwMzY3N0JlZmIyNUMwNEM4MUY4OUM0YzE4ZTc5YjE0NWFhMTM1XCIsXCJzdWJcIjpcIjRJcVpQT1dCQXcwRjJrdi1TamctMHhSU1BuSjNlQ2kxZm9wNGxqMUFBbjA9XCIsXCJhdWRcIjpcIlpvYmw1QzJHRWVvT1dudXdpb0RURDRBSnd1NlhFTW5WSEttWjZWOFZZLUU9XCIsXCJuYmZcIjoxNjY0MDM3MTkwLFwidGlkXCI6XCI1NDEwY2ZjNi0zMWFlLTRlOWQtODJhMC00NmQ4MjUyZDhlMDRcIixcImFkZFwiOlwiMHg5ZmE0NjNmNDg1OTRlYzE3MzViMWEwZTRjMGEwM2M3MTM5M2EzNzljYTRhOGQ5Yzg0ZmFhNTBlNzU1ZWQ5NTYyNmE0MzIxNTM2YThmNWFlY2Q4NDA2MDUwNDBjZGQ3NDEzNTQxNjRhZGY3MzdkZGEzODg2Y2Q2ZmJhMWE5YTE2MDFjXCJ9Il0=",
  },
})
  .then((res) => {
    console.log(res);
    return res.json();
  })
  .then((json) => {
    console.log(json);
  })
  .catch((error) => {
    console.log(error);
  });
