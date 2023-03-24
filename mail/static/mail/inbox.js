document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // Submit handler  
  document.querySelector('#compose-form').addEventListener('submit', send_email);

  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  document.querySelector('#email-detail').style.display = 'none';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) { 
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#email-detail').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
  // Fetch the API
  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(emails => {
    // Create a list item for each email in the mailbox
    emails.forEach(email => {

      // Create a new element
      const newEmail = document.createElement('div');
      newEmail.className = "list-group-item";
      newEmail.innerHTML = `From ${email.sender}: ${email.subject} ->> date: ${email.timestamp}`;

      // Change background color 
      newEmail.className = email.read ? 'read' : 'not-read';  

      // Add event listener to the div to open the detail view
      newEmail.addEventListener('click', () => view_email(email.id));

      // Append the email content
      document.querySelector('#emails-view').append(newEmail);
      
    });
  })
}

function send_email(event){
  event.preventDefault();
  // Save the form-data
  const recipients = document.querySelector('#compose-recipients').value;
  const subject = document.querySelector('#compose-subject').value;
  const body = document.querySelector('#compose-body').value;

  // Fetch the API
  fetch('/emails', {
    method: 'POST', 
    body: JSON.stringify({
      recipients: recipients,
      subject: subject,
      body: body
    })
  })
  .then(response => response.json())
  .then(result => {
    // Print result
    console.log(result);
    // Display the sent mailbox
    load_mailbox('sent');
  });
}

function view_email(email_id){
  var num = 0;
  // Fetch the API
  fetch(`/emails/${email_id}`)
  .then(response => response.json())
  .then(email => {
      // Print email
      console.log(email);

      // Display the email-detail view and hide the others
      document.querySelector('#email-detail').style.display = 'block';
      document.querySelector('#emails-view').style.display = 'none';
      document.querySelector('#compose-view').style.display = 'none';
      
      // Add the email data to html
      document.querySelector('#sender').innerHTML =  email.sender;
      document.querySelector('#recipient').innerHTML = email.recipients;
      document.querySelector('#subject').innerHTML = email.subject;
      document.querySelector('#timestamp').innerHTML = email.timestamp;
      document.querySelector('#body').innerHTML = email.body;


      // Archived or unarchived logic
      const button_archive = document.createElement('button');
      button_archive.innerHTML = email.archived ? "Unarchive" : "Archive";
      document.querySelector('#email-detail').append(button_archive)

      button_archive.addEventListener('click', function() {
        num ++;
        console.log(num);

      });

      // Mark the email as read
      ///if(!email.read) {
      //fetch(`/emails/${email.id}`, {
        //method: 'PUT',
        //body: JSON.stringify({
        //read: true
        //})
        //}
      //)};

    });
}

      

