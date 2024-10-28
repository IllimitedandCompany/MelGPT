var socket = io();
$('#msg').focus();

// Function to scroll down chat area
var scrollDown = function () {
  $('#msg_area').animate({ scrollTop: $('#msg_area')[0].scrollHeight }, "slow");
}

const loadingSpinner = document.getElementById('loading-spinner');

// Beautify message content based on simple markdown-like syntax
function beautifyText(text) {
  return text
  //.replace(/(?:^|\s)- (.*?)(?=\s- |$)/g, '<br>- $1')
  .replace(/(?:\s|^)(\d+)\. (.*?)(?=\s\d+\.|$)/g, '<br>$2') // Replace numbered lists
  .replace(/(?:\s|^) - (.*?)(?=\s- |$)/g, '<br>$1') // Replace bulleted lists
  .replace(/^# (.*?)$/gm, '<br><li class="heading1">$1</li>')                 // Headings (### Heading)
  .replace(/^## (.*?)$/gm, '<br><li class="heading2">$1</li>')                 // Headings (### Heading)
  .replace(/^### (.*?)$/gm, '<br><li class="heading3">$1</li>')                 // Headings (### Heading)
  .replace(/^#### (.*?)$/gm, '<br><li class="heading4">$1</li>')                 // Headings (### Heading)
  .replace(/^##### (.*?)$/gm, '<br><li class="heading5">$1</li>')                 // Headings (### Heading)
  .replace(/^###### (.*?)$/gm, '<br><li class="heading6">$1</li>')                 // Headings (### Heading)
  .replace(/\*\*(.*?)\*\*/g, '<span class="bold">$1</span>')               // Bold (**bold**)
  .replace(/_(.*?)_/g, '<span class="italic">$1</span>')                   // Italic (_italic_)
  .replace(/```javascript\s*([\s\S]*?)\s*```/g, '<li class="code-block">$1</li>') // Code block ```javascript code ```
  .replace(/```html\s*([\s\S]*?)\s*```/g, '<li class="code-block">$1</li>') // Code block ```javascript code ```
  .replace(/```(\w*)\s*([\s\S]*?)\s*```/g, '<li class="code-block">$1</li>')  // Code block for other languages
  .replace(/---/g, '<br><br><li class="heading">$1</li>');     // Code block for other languages
}

// Handle Enter key for sending messages
$('#msg').keyup(function(e) {
  if (e.keyCode === 13) {  // Enter key
    let msg = $('#msg').val();
    console.log(msg);

    // Beautify the message and add to chat area as <li>
    const beautifiedMessage = beautifyText(msg);
    $('#msg_area').append($('<li>').html(beautifiedMessage).addClass("message usermsg"));
    scrollDown();

    // Emit the message through socket
    socket.emit('usermsg', msg);
    loadingSpinner.style.display = 'block';

    // Clear input
    $('#msg').val('');
    return false;
  } else if (e.keyCode === 38) { // Up arrow key for quick edit
    $('#msg').val(msg);
  }
});

// Listen for bot messages from server
socket.on('botmsg', function(msg) {
  console.log(msg);

  // Beautify bot message and add to chat area as <li>
  const beautifiedMessage = beautifyText(msg);
  $('#msg_area').append($('<br><li>').html(beautifiedMessage).addClass("message botmsg"));
  
  loadingSpinner.style.display = 'none';
  scrollDown();
});