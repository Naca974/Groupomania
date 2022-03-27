<template>
  <div class="main profile">
    <!--  Profil title-->
    <h1 class="h1 text-center mt-5">Mon Profil</h1>

    <!--  Profil content-->
    <div class="container">
      <div class="profil-img">
        <img
          :src="loadImage()"
          alt=""
          class="rounded-circle d-flex align-items-center justify-content-center m-auto mt-5"
        />
      </div>
      <div class="profil-resum">
        <h2 class="h2 text-center mt-5">Bienvenue {{ userData.username }}</h2>

        <q class="d-flex justify-content-center m-auto mt-5"
          >Que souhaitez vous faire ?
        </q>

        <div
          class="d-flex flex-column justify-content-center align-items-center mt-5"
        >
          <label for="file">Modifiez votre photo</label>
          <input
            class="btn main-btn mb-5"
            type="file"
            name="image"
            id="file"
            @change="onSelect"
            required
          />
        </div>
        <div v-show="success" class="success-msg">
          <h3>User Update Successful</h3>
        </div>
        <div v-show="fail" class="error-msg">
          <h3>Error Updating User</h3>
        </div>
        <form class="col-sm-12 col-lg-6 m-auto mb-5">
          <div class="mb-3 mt-3">
            <label for="email" class="form-label white">Adresse Email</label>
            <input
              type="email"
              class="form-control"
              id="email"
              aria-describedby="emailHelp"
              v-model="email"
              placeholder="email"
              disabled="true"
            />
          </div>
          <div class="mb-3">
            <label for="validPassword" class="form-label white"
              >Biography</label
            >
            <textarea
              v-model="bio"
              class="form-control"
              id="contenu"
              rows="3"
              placeholder="Votre Biography"
            ></textarea>
          </div>
          <div class="flex-cont mb-5">
            <button
              type="submit"
              class="btn main-btn d-flex m-auto"
              v-on:click.prevent="updateProfile"
            >
              Modifier Compte
            </button>
            <button
              @click.prevent="deleteMyAccount"
              type="button"
              class="btn main-btn"
              id="delete-btn"
            >
              Supprimer Compte
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Profile",
  data() {
    return {
      isUpdate: false,
      email: "",
      password: "",
      confirmPassword: "",
      bio: "",
      image: null,
      userData: null,
      success: false,
      fail: false,
      userId: JSON.parse(localStorage.getItem("userId")),
    };
  },
  created() {
    this.getProfile();
  },
  methods: {
    onSelect(event) {
      this.image = event.target.files[0];
      this.isUpdate = true;
    },
    updateProfile() {
      const user = {
        bio: this.bio,
      };
      if (this.isUpdate) {
        const formData = new FormData();
        formData.append("image", this.image);
        formData.append("user", JSON.stringify(user));
        console.log(formData);
        axios
          .put(process.env.VUE_APP_API_BACKEND_URL + "user/profile", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          })
          .then(() => {
            console.log("User Updated");
            this.success = true;
            setTimeout(() => {
              this.success = false;
              this.getProfile();
            }, 2000);
            //this.clearData();
          })
          .catch((error) => {
            console.log(error.message);
            this.fail = true;
            setTimeout(() => {
              this.fail = false;
            }, 3000);
          });
      } else {
        axios
          .put(process.env.VUE_APP_API_BACKEND_URL + "user/profile", user, {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          })
          .then(() => {
            console.log("User Updated");
            this.success = true;
            setTimeout(() => {
              this.success = false;
              this.getProfile();
            }, 2000);
            //this.clearData();
          })
          .catch((error) => {
            console.log(error.message);
            this.fail = true;
            setTimeout(() => {
              this.fail = false;
            }, 3000);
          });
      }
    },
    getProfile() {
      axios
        .get(process.env.VUE_APP_API_BACKEND_URL + "user/profile", {
          headers: { Authorization: "Bearer " + localStorage.getItem("token") },
        })
        .then((reponse) => {
          console.log(reponse.data);
          this.userData = reponse.data;
          this.email = this.userData.email;
          this.bio = this.userData.bio;
        })
        .catch((error) => {
          console.log(error.message);
        });
    },
    clearData() {
      this.password = null;
      this.confirmPassword = null;
      this.bio = this.userData.bio;
      this.image = this.userData.profile;
    },
    loadImage() {
      console.log("inh ere");
      if (this.userData) {
        console.log("inside");
        return this.userData.profile;
      } else {
        console.log("outside");
        return '../assets/default.png`;
      }
    },
    deleteMyAccount() {
      axios
        .delete(
          `${process.env.VUE_APP_API_BACKEND_URL}user/${this.userId}/delete`,
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        )
        .then((reponse) => {
          console.log(reponse.data);
          this.$router.push({ name: "signup" });
        })
        .catch((error) => {
          console.log(error.message);
        });
    },
  },
};
</script>

<style scoped></style>
