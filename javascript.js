// this is not the actual calculation. this is just to present "what" should happen in UI
document.addEventListener('DOMContentLoaded', () => {
  const forms = document.querySelectorAll('form');

  const toggleButton = document.getElementById('toggleButton');
  const summaryContent = document.getElementById('summaryContent');
  const summaryHeader = document.getElementById('summaryHeader');
  const calculationsSection = document.getElementById('calculationsSection');
  let isMinimized = false;

summaryHeader.addEventListener('click', () => {
  isMinimized = !isMinimized;

  if (isMinimized) {
    summaryContent.style.display = 'none';
    toggleButton.querySelector('i').classList.replace('fa-chevron-up', 'fa-chevron-down');
    calculationsSection.style.width = '';
  } else {
    summaryContent.style.display = 'block';
    toggleButton.querySelector('i').classList.replace('fa-chevron-down', 'fa-chevron-up');
    calculationsSection.style.width = '';
  }
});

  const rtoSelect = document.querySelector('select[name="rto"]');
  const rtoDatesInput = document.querySelector('input[name="rto_dates"]');
  rtoDatesInput.disabled = true;

  rtoSelect.addEventListener("change", () => {
    if (rtoSelect.value === "Yes") {
      rtoDatesInput.disabled = false;
      rtoDatesInput.required = true;
      rtoDatesInput.placeholder = 'Type here...';
    } else {
      rtoDatesInput.disabled = true;
      rtoDatesInput.required = false;
      rtoDatesInput.value = "";
      rtoDatesInput.placeholder = '';
    }
  });

  const rtoContractSelect = document.querySelector('select[name="rto_contract"]');
  const reimbursementInput = document.querySelector('input[name="reimbursement"]');
  reimbursementInput.disabled = true;

  rtoContractSelect.addEventListener("change", () => {
    if (rtoSelect.value === "Yes") {
      reimbursementInput.disabled = false;
      reimbursementInput.required = true;
      reimbursementInput.placeholder = 'Type here...';
    } else {
      reimbursementInput.disabled = true;
      reimbursementInput.required = false;
      reimbursementInput.value = "";
      reimbursementInput.placeholder = '';
    }
  });

  forms.forEach(f => f.addEventListener("input", updateSummary));

  updateSummary(); 
});

function updateSummary() {

  const form1 = document.getElementById('form1');
  const form2 = document.getElementById('form2');
  const form3 = document.getElementById('form3');
  const form4 = document.getElementById('form4');
  const form5 = document.getElementById('form5');

  const form1Total = (parseFloat(form1.vendor_fee_percent.value) || 0) + (parseFloat(form1.prompt_pay_discount.value) || 0);

  const nurseHourlyRate = parseFloat(form2.hourly_rate?.value) || 0;
  const overtimeRate = parseFloat(form2.overtime_hourly_rate?.value) || 0;
  const hours = 40;
  const overtimeHours = 5;
  const regularPay = hours * nurseHourlyRate;
  const overtimePay = overtimeHours * overtimeRate;
  const form2Total = regularPay + overtimePay;

  const daysPerWeek = parseFloat(form3.days_per_week.value) || 0;
  const hoursPerShift = parseFloat(form3.hours_per_shift?.value) || 0;
  const bonus = parseFloat(form3.bonus?.value) || 0;
  const nonBillable = parseFloat(form3.non_billable?.value) || 0;
  const trueMargin = parseFloat(form3.true_margin?.value) || 0;
  const totalHours = (daysPerWeek * hoursPerShift * 4) - nonBillable;
  const form3Total = (totalHours + bonus) * (1 + trueMargin / 100);

  const numberOfWeeks = parseFloat(form4.number_of_weeks.value) || 0;
  const reimbursementValue = parseFloat(form4.reimbursement.value) || 0;
  const form4Total = numberOfWeeks + reimbursementValue;

  const billRate = parseFloat(form5.bill_rate?.value) || 0;
  const payRateMultiplier = parseFloat(form5.pay_rate?.value) || 0;
  const housingRate = parseFloat(form5.housing_rate_per_day?.value) || 0;
  const mealsRate = parseFloat(form5.meals_rate_per_day?.value) || 0;
  const form5Total = (billRate * payRateMultiplier) + housingRate + mealsRate;

  const grandTotal = form1Total + form2Total + form3Total + form4Total + form5Total;

 
  const estWeekTaxableWages = nurseHourlyRate * 40;
  const estTotalWages = estWeekTaxableWages + overtimeRate * 5;
  const weeklyPayPlusPerDiem = estTotalWages + 100;
  const effectiveHourlyRate = weeklyPayPlusPerDiem / 45;

  document.getElementById('nurseHourlyRate').textContent = `Hourly Rate: $${nurseHourlyRate.toFixed(2)}`;
  document.getElementById('nurseOvertimeRate').textContent = `Overtime Rate: $${overtimeRate.toFixed(2)}`;
  document.getElementById('estWeeklyWages').textContent = `Est. Weekly Taxable Wages: $${estWeekTaxableWages.toFixed(2)}`;
  document.getElementById('estTotalWages').textContent = `Est. Total Wages: $${estTotalWages.toFixed(2)}`;
  document.getElementById('weeklyPayPerDiem').textContent = `Weekly Pay + Per Diem: $${weeklyPayPlusPerDiem.toFixed(2)}`;
  document.getElementById('effectiveHourlyRate').textContent = `Effective Hourly Rate: $${effectiveHourlyRate.toFixed(2)}`;

 
  const factoringFees = grandTotal * 0.0003;
  const vendorFees = grandTotal * 0.05;
  const benefits = grandTotal * 0.1;
  const employerPayrollTaxes = grandTotal * 0.075;
  const match401k = grandTotal * 0.03;
  const totalOverheads = factoringFees + vendorFees + benefits + reimbursementValue + employerPayrollTaxes + match401k;
  const totalProjectNetIncome = grandTotal - totalOverheads;
  const marginPercent = (totalProjectNetIncome / grandTotal) * 100;

  document.getElementById('factoringFees').textContent = `Factoring Fees: $${factoringFees.toFixed(2)}`;
  document.getElementById('vendorFees').textContent = `Vendor Fees: $${vendorFees.toFixed(2)}`;
  document.getElementById('benefits').textContent = `Benefits: $${benefits.toFixed(2)}`;
  document.getElementById('reimbursement').textContent = `Reimbursement: $${reimbursementValue.toFixed(2)}`;
  document.getElementById('payrollTaxes').textContent = `Employer Payroll Taxes: $${employerPayrollTaxes.toFixed(2)}`;
  document.getElementById('match401k').textContent = `401k Match: $${match401k.toFixed(2)}`;
  document.getElementById('totalOverheads').textContent = `Total Overheads: $${totalOverheads.toFixed(2)}`;
  document.getElementById('netIncome').textContent = `Project Net Income: $${totalProjectNetIncome.toFixed(2)}`;
  document.getElementById('marginPercent').textContent = `Margin %: ${marginPercent.toFixed(2)}%`;


  document.getElementById('form1Total').textContent = form1Total.toFixed(2);
  document.getElementById('form2Total').textContent = form2Total.toFixed(2);
  document.getElementById('form3Total').textContent = form3Total.toFixed(2);
  document.getElementById('form4Total').textContent = form4Total.toFixed(2);
  document.getElementById('form5Total').textContent = form5Total.toFixed(2);
  document.getElementById('grandTotal').textContent = grandTotal.toFixed(2);
}
