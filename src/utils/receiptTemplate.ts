export function generateReceiptText(request: any) {
  const formatTime = (date: Date | null) => 
    date ? new Date(date).toLocaleString() : 'N/A';
  
  const hours = calculateHours(new Date(request.entryTime), request.exitTime ? new Date(request.exitTime) : new Date());

  return `
    PARKING RECEIPT #${request.id.slice(0, 8).toUpperCase()}
    ================================
    Plate: ${request.plateNumber}
    Entry: ${formatTime(request.entryTime)}
    Exit: ${formatTime(request.exitTime)}
    Duration: ${hours} hours
    Amount Due: ${request.amountDue || 0} RWF
    ================================
    PAYMENT METHODS:
    1. Mobile Money: *182*6*1*0781234567
    2. Cash at Admin Office
    ================================
    Status: ${request.status.toUpperCase()}
    Thank you for parking with us!
  `;
}

export function generateReceiptHTML(request: any) {
  const formatTime = (date: Date | null) => 
    date ? new Date(date).toLocaleString() : 'N/A';
  
  const hours = calculateHours(new Date(request.entryTime), request.exitTime ? new Date(request.exitTime) : new Date());

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333; text-align: center;">PARKING RECEIPT #${request.id.slice(0, 8).toUpperCase()}</h2>
      <hr style="border: 1px solid #ddd;">
      <table style="width: 100%; margin-bottom: 20px;">
        <tr>
          <td><strong>Plate:</strong></td>
          <td>${request.plateNumber}</td>
        </tr>
        <tr>
          <td><strong>Entry:</strong></td>
          <td>${formatTime(request.entryTime)}</td>
        </tr>
        <tr>
          <td><strong>Exit:</strong></td>
          <td>${formatTime(request.exitTime)}</td>
        </tr>
        <tr>
          <td><strong>Duration:</strong></td>
          <td>${hours} hours</td>
        </tr>
        <tr>
          <td><strong>Amount Due:</strong></td>
          <td>${request.amountDue || 0} RWF</td>
        </tr>
      </table>
      <hr style="border: 1px solid #ddd;">
      <h3 style="color: #333;">PAYMENT METHODS:</h3>
      <ol>
        <li>Mobile Money: <strong>*182*6*1*0781234567</strong></li>
        <li>Cash at Admin Office</li>
      </ol>
      <hr style="border: 1px solid #ddd;">
      <p style="text-align: center;">
        <strong>Status:</strong> ${request.status.toUpperCase()}<br>
        Thank you for parking with us!
      </p>
    </div>
  `;
}

function calculateHours(start: Date, end: Date): number {
  return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60));
}