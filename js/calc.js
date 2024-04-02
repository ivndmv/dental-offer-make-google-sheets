function translate(string) {
    const wpLanguage = window.location.href

    let translationsBg = {
        'Behandlung': 'Лечение',
        'Positionen': 'Позиции',
        'Preis': 'Цена',
        'Menge': 'Количество',
        'Kosten': 'Общо',
        'Treffen': 'Етап',
        'Total kost': 'Общо всичко'
        
    }

    let translationsEn = {
        'Behandlung': 'Treatment',
        'Positionen': 'Positions',
        'Preis': 'Price',
        'Menge': 'Quantity',
        'Kosten': 'Total',
        'Treffen': 'Stage',
        'Total kost': 'Total'
    }

    //return translated string based on WP language

    //default language is de
    if (wpLanguage.includes('de')) {
        return string
    }
    //english language
    if (wpLanguage.includes('en')) {
        return translationsEn[string]
    }
    //bulgarian language
    if (wpLanguage.includes('bg')) {
        return translationsBg[string]
    }
}

const categoryContainers = document.querySelectorAll('.category-container')
const resultContainerOuter = document.querySelector('#result-container')
const totalRate = document.querySelector('#total-rate')
const allContainer = document.querySelector('#all-container')
const totalRackRate = document.querySelector('#total-rack-rate')
const patientName = document.querySelector('#patient-name')
const freeFormText = document.querySelector('#free-form-text')
const discountField = document.querySelector('#discount')
let discount = ''

const stages = document.querySelector('#stages')
const selectStage = document.querySelector('#the-stage')
const resultContainer = document.querySelector('#tables-container')
const grandTotal = document.querySelector('#grand-total')
const catContSelects = document.querySelectorAll('.select-service')
let editTableButtons = ''

const stageOptionDefault = document.createElement('option')
stageOptionDefault.value = 'Select Stage'
stageOptionDefault.textContent = 'Select Stage'
stageOptionDefault.setAttribute('selected', 'selected')


let date  = new Date();
let dateFormatted = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear()

console.dir(date)

stages.addEventListener('input', e => {

    if(stages.value > 0) {
        selectStage.innerHTML = '' // remove everything if stage quantity is changed
        resultContainer.innerHTML = '' // remove everything if stage quantity is changed

        selectStage.removeAttribute('disabled')
        console.log(stages.value)
        count = 0;
        for (let i = 1; i<=stages.value; i++) {

            let stageOption = document.createElement('option')
            stageOption.value = i
            stageOption.textContent = translate('Treffen') + ' ' + i
            selectStage.appendChild(stageOption)

            let stageTables = document.createElement('table')
            stageTables.id = 'table-' + i;
            stageTables.classList.add('price-table')
            stageTables.innerHTML += `<thead><tr><th>${translate('Behandlung')}</th><th>${translate('Positionen')}</th><th>${translate('Preis')}</th><th>${translate('Menge')}</th><th>${translate('Kosten')}</th></tr></thead>`
            resultContainer.appendChild(stageTables)

            stageTables.insertAdjacentHTML (
                'beforebegin',
                '<div class="table-title">' + stageOption.textContent + '</div>'
            )

            stageTables.insertAdjacentHTML (
                'beforeend',
                `<div class="table-total-container">${translate('Kosten')} ${stageOption.textContent}: <strong><span class="table-total" data-table-total=""></span></strong><br><button class="edit-table">Edit</button></div>`
            )
            
            selectStage.prepend(stageOptionDefault)
        }
    } else {
        selectStage.setAttribute('disabled', 'disabled')
    }

})

let currentTable = ''
selectStage.addEventListener('change', e => {
    stages.setAttribute('disabled', 'disabled')
    document.querySelector('label[for=stages]').textContent = "You are not able to change the stages anymore!"
    currentTable = document.querySelector('#table-' + selectStage.value)
    catContSelects.forEach(catContSelect => {
        if (selectStage.value !== 'Select Stage') {
            catContSelect.removeAttribute('disabled')
        } else {
            catContSelect.setAttribute('disabled', 'disabled')
        }
    })
})

categoryContainers.forEach(categoryContainer => {
    let select = categoryContainer.querySelector('select')
    let addButton = document.createElement('a')
    addButton.innerHTML = '+'
    addButton.classList.add('add-button')
    addButton.setAttribute('data-name', select.name)
    categoryContainer.append(addButton)

    addButton.addEventListener('click', e => {

        let rate = select.options[select.options.selectedIndex].getAttribute('data-rate')
        let rackRate = select.options[select.options.selectedIndex].getAttribute('data-rack-rate')
        let serviceName = select.value
        let rows = currentTable.querySelectorAll('tr')

        let checkDuplicates = false
        rows.forEach(row => {
            servicesNameCells = row.querySelectorAll('td[data-service-name]')
            servicesNameCells.forEach(servicesNameCell => {
                if (servicesNameCell.innerHTML == serviceName) {
                    checkDuplicates = true
                    //row.querySelector('.quantity').innerHTML += 1;
                } 
            })
        })
        // console.log(checkDuplicates)

       
        if (checkDuplicates == false) {
            currentTable.insertAdjacentHTML ( //<td class="rate-to-sum" data-rate-to-sum="${rate}">${rate} €</td>
            'beforeend', 
            `<tr>
                <td class="service-name" data-service-name="${serviceName}">${serviceName}</td>
                <td class="teeth-position" data-service-name="${serviceName}"></td>
                <td class="rack-rate-to-sum-price" data-service-name="${serviceName}" data-rack-rate-to-sum="${rackRate}">${rackRate} €</td>
                <td class="quantity" data-quantity="1" data-service-name="${serviceName}">1</td>
                <td class="rack-rate-to-sum" data-rack-rate-to-sum="${rackRate}" data-service-name="${serviceName}">${rackRate} €</td>
                </tr>`
            )

        } else {
            let quantityCell = currentTable.querySelector(`.quantity[data-service-name="${serviceName}"]`)
            let totalCell = currentTable.querySelector(`.rack-rate-to-sum[data-service-name="${serviceName}"]`)
            let priceCell = currentTable.querySelector(`.rack-rate-to-sum-price[data-service-name="${serviceName}"]`)
            let quantity = 1

            quantity = quantityCell.innerHTML

            quantity++
            quantityCell.innerHTML = quantity;
            quantityCell.setAttribute('data-quantity', quantity)
            console.log(totalCell)

            totalCell.innerHTML = quantity * priceCell.getAttribute('data-rack-rate-to-sum') + ' €'
            totalCell.setAttribute('data-rack-rate-to-sum', quantity * priceCell.getAttribute('data-rack-rate-to-sum'))

        }  

        // Sum Totals

        let currentTableTotal = []
        let grandTotalArr = []
        allRackRatesToSum = currentTable.querySelectorAll('.rack-rate-to-sum')
        allRackRatesToSum.forEach (rrToSum => {
            currentTableTotal.push(Number(rrToSum.getAttribute('data-rack-rate-to-sum')))
            console.log(currentTableTotal)
        })
        currentTable.querySelector('.table-total').textContent = currentTableTotal.reduce((partialSum, a) => partialSum + a, 0) + ' €'
        currentTable.querySelector('.table-total').setAttribute('data-table-total', currentTableTotal.reduce((partialSum, a) => partialSum + a, 0))

        const tablesTotals = document.querySelectorAll('.table-total')
        tablesTotals.forEach(tableTotal => {
            grandTotalArr.push(Number(tableTotal.getAttribute('data-table-total')))
        })
        console.log(grandTotalArr)
        grandTotal.innerHTML = translate('Total kost') + ': <strong>' + grandTotalArr.reduce((partialSum, a) => partialSum + a, 0) + '  €</strong>'
        grandTotal.setAttribute('data-grand-total', grandTotalArr.reduce((partialSum, a) => partialSum + a, 0))

    })
})


//edit table
resultContainerOuter.addEventListener('click', e => {
    if(e.target.innerHTML == 'Edit' && e.target.classList.contains('edit-table')) {

        // switch to edit view
        e.target.innerHTML = 'Save'
        let clickedButton = e.target
        e.target.parentElement.parentElement.style.border = '3px solid rgb(195 255 195)'
        let thisTableServiceNames = e.target.parentElement.parentElement.querySelectorAll('.service-name')
        console.log(thisTableServiceNames)

        //service names add remove button element
        thisTableServiceNames.forEach(thisTableService => {
            thisTableService.innerHTML += '<span class="remove-row" style="display:block;">X</span>'
        })

        document.querySelectorAll('.service-name .remove-row').forEach(removeButton => { 
            removeButton.addEventListener('click', e => {
                console.log(removeButton.parentElement.parentElement.parentElement.parentElement)

                let thisTableTotal = removeButton.parentElement.parentElement.parentElement.parentElement.querySelector('.table-total')
                let removedCellCost = removeButton.parentElement.parentElement.querySelector('.rack-rate-to-sum')
                let thisTableGrandTotal = document.querySelector('#grand-total')

                thisTableTotal.setAttribute('data-table-total', thisTableTotal.getAttribute('data-table-total') - removedCellCost.getAttribute('data-rack-rate-to-sum'))
                thisTableTotal.innerHTML = thisTableTotal.getAttribute('data-table-total') + ' €'

                thisTableGrandTotal.setAttribute('data-grand-total', thisTableGrandTotal.getAttribute('data-grand-total') - removedCellCost.getAttribute('data-rack-rate-to-sum'))
                thisTableGrandTotal.innerHTML = translate('Total kost') + ': <strong>' + thisTableGrandTotal.getAttribute('data-grand-total') + '  €</strong>'

                removeButton.parentElement.parentElement.remove()
            })
        })

        //teeth positions
        e.target.parentElement.parentElement.querySelectorAll('.teeth-position').forEach(teethPos => {
            teethPos.setAttribute('style', 'background: url(/wp-content/uploads/2023/11/edit-btn.png); background-size: 24px; background-position: top right; background-repeat: no-repeat; padding: 25px;')
        })
        e.target.parentElement.parentElement.addEventListener('click', e => {
            if(e.target.classList.contains('teeth-position') && clickedButton.innerHTML == 'Save') {
                e.target.innerHTML = "<textarea class='edit-cell-textarea'>"
            }
        })

        //qunatity
        e.target.parentElement.parentElement.querySelectorAll('.quantity').forEach(tableQuantity => {
            tableQuantity.setAttribute('style', 'background: url(/wp-content/uploads/2023/11/edit-btn.png); background-size: 24px; background-position: top right; background-repeat: no-repeat; padding: 25px;')
        })
        e.target.parentElement.parentElement.addEventListener('click', e => {
            if(e.target.classList.contains('quantity') && clickedButton.innerHTML == 'Save') {
                e.target.innerHTML = "<input type='number' class='edit-cell-quantity'>"
            }
        })


    } else if (e.target.innerHTML == 'Save' && e.target.classList.contains('edit-table')) {

        //service names remove buttons
        e.target.parentElement.parentElement.querySelectorAll('.service-name .remove-row').forEach(removeButton => {
            removeButton.remove()
        })        

        //teeth positions
        e.target.parentElement.parentElement.querySelectorAll('.teeth-position').forEach(teethPos => {
            teethPos.removeAttribute('style')
        })

        //quantity
        e.target.parentElement.parentElement.querySelectorAll('.quantity').forEach(tableQuantity => {
            tableQuantity.removeAttribute('style')
        })

        //teeth positions
        e.target.parentElement.parentElement.style.border = 'none'
        let editTextareas = e.target.parentElement.parentElement.querySelectorAll('.edit-cell-textarea')
        editTextareas.forEach(editTextarea => {
            editTextarea.parentElement.innerHTML = editTextarea.value
        })


        //service names click remove buttons


        //quantity
        e.target.parentElement.parentElement.style.border = 'none'
        let editQuantities = e.target.parentElement.parentElement.querySelectorAll('.edit-cell-quantity')
        editQuantities.forEach(editQuantity => {
            let thisCellPrice = editQuantity.parentElement.previousSibling.previousElementSibling.getAttribute('data-rack-rate-to-sum')
            let thisCellTotal = editQuantity.parentElement.nextSibling.nextElementSibling
            let thisTableTotal = editQuantity.parentElement.parentElement.parentElement.parentElement.querySelector('.table-total-container strong span')
            let thisTableAllPrices = editQuantity.parentElement.parentElement.parentElement.parentElement.querySelectorAll('.rack-rate-to-sum')
            let thisTableGrandTotal = document.querySelector('#grand-total')
            let thisTableTotalArr = []
            let thisGrandTotalArr = []
            console.log(thisTableAllPrices)


            editQuantity.parentElement.setAttribute('data-quantity', editQuantity.value)
            editQuantity.parentElement.innerHTML = editQuantity.value
            //calculate cell price
            thisCellTotal.setAttribute('data-rack-rate-to-sum', thisCellPrice * editQuantity.value)
            thisCellTotal.innerHTML = thisCellTotal.getAttribute('data-rack-rate-to-sum') + ' €'
            //calculate total table price
            thisTableAllPrices.forEach(thisRowPrice => {
                thisTableTotalArr.push(Number(thisRowPrice.getAttribute('data-rack-rate-to-sum')))
            })
            thisTableTotal.setAttribute('data-table-total', thisTableTotalArr.reduce((partialSum, a) => partialSum + a, 0))
            thisTableTotal.innerHTML = thisTableTotal.getAttribute('data-table-total') + ' €'

            let thisTableTotals = document.querySelectorAll('.table-total-container strong span')
            thisTableTotals.forEach (ttTableTotal => {
                thisGrandTotalArr.push(Number(ttTableTotal.getAttribute('data-table-total')))
            })
            thisTableGrandTotal.setAttribute('data-grand-total', thisGrandTotalArr.reduce((partialSum, a) => partialSum + a, 0))
            thisTableGrandTotal.innerHTML = translate('Total kost') + ': <strong>' + thisTableGrandTotal.getAttribute('data-grand-total') + ' €</strong>' 
        })

        // switch to normal view
        e.target.innerHTML = 'Edit'
    }
})

function applyDiscount() {
    discount = Number(discountField.value) / 100
    const allRates = document.querySelectorAll('.rack-rate-to-sum')
    const allTotals = document.querySelectorAll('.table-total')
    const theGrandTotal = document.querySelector('#grand-total')

    allRates.forEach(allRate => {
        allRate.innerHTML = ''
        allRate.innerHTML = `<s style="font-size: 90%; font-weight: normal">${allRate.getAttribute('data-rack-rate-to-sum')} €</s><br>${allRate.getAttribute('data-rack-rate-to-sum') - (discount * allRate.getAttribute('data-rack-rate-to-sum'))} €` 
    })

    allTotals.forEach(allTotal => {
        allTotal.innerHTML = ''
        allTotal.innerHTML = `<s style="font-size: 90%; font-weight: normal">${allTotal.getAttribute('data-table-total')} €</s><br>${allTotal.getAttribute('data-table-total') - (discount * allTotal.getAttribute('data-table-total'))} €` 

    })

    theGrandTotal.innerHTML = ''
    theGrandTotal.innerHTML = `${translate('Total kost')}: <s style="font-size: 90%; font-weight: normal">${theGrandTotal.getAttribute('data-grand-total')} €</s><br><strong>${theGrandTotal.getAttribute('data-grand-total') - (discount * theGrandTotal.getAttribute('data-grand-total'))}  €</strong>` 
}

//show/hide buttons

const templateHeader = document.querySelector('.template-header')
const templateFooter = document.querySelector('.template-footer')
const theForms = document.querySelector('#form-container')
const previewBtn = document.querySelector('#previewBtn')
const generateDiscount = document.querySelector('#generate-discount')
const finalButtonsContainer = document.querySelector('#final-buttons-container')
const templateBox = document.querySelector('#template-box')
const backButton = document.createElement('button')
backButton.innerHTML = '↺ Back and edit'
const printButton = document.createElement('button')
printButton.innerHTML = 'Download PDF'

discountField.addEventListener('input', e => { 
    if(discountField.value.charAt(0) === '0') {
        discountField.value = discountField.value.slice(1);
    }
    if (discountField.checkValidity()) {
        generateDiscount.removeAttribute('disabled')
    } else {
        generateDiscount.setAttribute('disabled', 'disabled')
        discountField.reportValidity()
    }
})

// discountField.addEventListener('change', e => {
//     if (discountField.checkValidity()) {
//         generateDiscount.removeAttribute('disabled')
//     } else {
//         generateDiscount.setAttribute('disabled', 'disabled')
//         discountField.reportValidity()
//     }
// })

generateDiscount.addEventListener('click', e => {
    applyDiscount()
})

patientName.addEventListener('change', e => {
    document.querySelector('.patient-name-template').textContent = patientName.value
})

freeFormText.addEventListener('change', e => {
    document.querySelector('.free-form-text-template').textContent = freeFormText.value
})

previewBtn.addEventListener('click', e => {
    theForms.style.display = "none"
    finalButtonsContainer.append(printButton)
    finalButtonsContainer.append(backButton)
    previewBtn.style.display = 'none'
    generateDiscount.style.display = 'none'
    backButton.style.display = 'block'
    printButton.style.display = 'block'
    allContainer.style.display = 'block'
    templateBox.style.display = 'block'
    templateHeader.style.display = 'block'
    templateFooter.style.display = 'block'
    allContainer.style.width = "800px"
    resultContainerOuter.style.width = "100%"
    document.querySelectorAll('.edit-table').forEach(edtbtn => {edtbtn.style.display = 'none'})
})
backButton.addEventListener('click', e => {
    theForms.style.display = 'block'
    backButton.style.display = 'none'
    printButton.style.display = 'none'
    previewBtn.style.display = 'block'
    generateDiscount.style.display = 'block'
    allContainer.style.display = 'flex'
    templateBox.style.display = 'none'
    templateHeader.style.display = 'none'
    templateFooter.style.display = 'none'
    allContainer.style.width = "unset"
    resultContainerOuter.style.width = "50%"
    document.querySelectorAll('.edit-table').forEach(edtbtn => {edtbtn.style.display = 'block'})
})
printButton.addEventListener ('click', e => {
    backButton.style.display = 'none'
    printButton.style.display = 'none'
    window.print()
})