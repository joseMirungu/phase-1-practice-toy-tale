let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  const toyCollection = document.getElementById("toy-collection");
  const addToyForm = document.querySelector(".add-toy-form");

  addBtn.addEventListener("click", () => {
 
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });


  fetch('http://localhost:3000/toys')
    .then(response => response.json())
    .then(toys => {
      toys.forEach(toy => {
        renderToy(toy);
      });
    });


  function renderToy(toy) {
    const toyCard = document.createElement("div");
    toyCard.className = "card";
    
    toyCard.innerHTML = `
      <h2>${toy.name}</h2>
      <img src="${toy.image}" class="toy-avatar" />
      <p>${toy.likes} Likes</p>
      <button class="like-btn" id="${toy.id}">Like ❤️</button>
    `;

    toyCard.querySelector(".like-btn").addEventListener("click", () => {
      updateLikes(toy);
    });

    toyCollection.appendChild(toyCard);
  }


  function updateLikes(toy) {
    const newLikes = toy.likes + 1;

    fetch(`http://localhost:3000/toys/${toy.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({ likes: newLikes })
    })
    .then(response => response.json())
    .then(updatedToy => {
      toy.likes = updatedToy.likes;
      const toyCard = document.getElementById(`${toy.id}`).parentNode;
      toyCard.querySelector("p").innerText = `${updatedToy.likes} Likes`;
    });
  }

 
  addToyForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const toyName = e.target.name.value;
    const toyImage = e.target.image.value;

    fetch('http://localhost:3000/toys', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        name: toyName,
        image: toyImage,
        likes: 0
      })
    })
    .then(response => response.json())
    .then(newToy => {
      renderToy(newToy);
    });

    e.target.reset();
  });
});
