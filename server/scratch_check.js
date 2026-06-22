const API_URL = 'http://127.0.0.1:5000/api';

const runTests = async () => {
  try {
    console.log('--- STARTING PROGRAMMATIC INTEGRATION TESTS ---');
    const randomSuffix = Math.floor(Math.random() * 10000);
    const registerPayload = {
      companyName: `Test Org ${randomSuffix}`,
      companyEmail: `company-${randomSuffix}@test.com`,
      industry: 'Technology',
      adminName: 'Test Admin',
      adminEmail: `admin-${randomSuffix}@test.com`,
      password: 'Password123'
    };

    // 1. Register Company & Admin
    console.log('\n1. Registering company workspace...');
    const regRes = await fetch(`${API_URL}/auth/register-company`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(registerPayload)
    });
    const regData = await regRes.json();
    if (!regData.success) {
      throw new Error(`Registration failed: ${JSON.stringify(regData)}`);
    }
    const adminToken = regData.token;
    console.log(`Registered! Token obtained. Workspace URL: /${regData.user.company.workspaceUrl}`);

    // 2. Update Company settings (Branding parameters & shifts)
    console.log('\n2. Updating workspace profile settings (Admin)...');
    const updateCompRes = await fetch(`${API_URL}/companies/me`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        name: `Acme Corp ${randomSuffix}`,
        email: `contact-${randomSuffix}@acme.com`,
        industry: 'Software Services',
        shiftGrace: 25
      })
    });
    const updateCompData = await updateCompRes.json();
    if (!updateCompData.success) {
      throw new Error(`Update company failed: ${JSON.stringify(updateCompData)}`);
    }
    console.log('Workspace profile updated successfully:', {
      name: updateCompData.company.name,
      email: updateCompData.company.email,
      industry: updateCompData.company.industry,
      shiftGrace: updateCompData.company.shiftGrace
    });

    // 3. Create a Manager
    console.log('\n3. Creating new Manager (Admin)...');
    const mgrRes = await fetch(`${API_URL}/users/create-manager`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        name: 'Alex Manager',
        email: `alex-${randomSuffix}@manager.com`,
        phone: '9999888877',
        designation: 'Engineering Manager',
        department: 'Engineering'
      })
    });
    const mgrData = await mgrRes.json();
    if (!mgrData.success) {
      throw new Error(`Manager creation failed: ${JSON.stringify(mgrData)}`);
    }
    const managerEmail = mgrData.user.email;
    const tempPassword = mgrData.tempPassword || 'Temp@123';
    console.log(`Manager created successfully! Email: ${managerEmail}, Temp Password: ${tempPassword}`);

    // 4. Authenticate as Manager & change password
    console.log('\n4. Logging in as Manager with temporary password...');
    const mgrLoginRes = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: managerEmail, password: tempPassword })
    });
    const mgrLoginData = await mgrLoginRes.json();
    if (!mgrLoginData.success) {
      throw new Error(`Manager login failed: ${JSON.stringify(mgrLoginData)}`);
    }
    let managerToken = mgrLoginData.token;
    console.log('Logged in! Changing password to resolve forced first-time change...');

    const changePwdRes = await fetch(`${API_URL}/auth/change-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${managerToken}`
      },
      body: JSON.stringify({ currentPassword: tempPassword, newPassword: 'Password123' })
    });
    const changePwdData = await changePwdRes.json();
    if (!changePwdData.success) {
      throw new Error(`Password change failed: ${JSON.stringify(changePwdData)}`);
    }
    console.log('Password updated successfully. Logging in again to fetch fresh session...');

    const mgrLoginRes2 = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: managerEmail, password: 'Password123' })
    });
    const mgrLoginData2 = await mgrLoginRes2.json();
    managerToken = mgrLoginData2.token;
    console.log('Manager token acquired successfully.');

    // 5. Create an Employee (Admin)
    console.log('\n5. Creating new employee Jane Doe...');
    const empRes = await fetch(`${API_URL}/users/create-employee`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        name: 'Jane Doe',
        email: `jane-${randomSuffix}@doe.com`,
        phone: '9876543210',
        designation: 'Engineer',
        department: 'Engineering'
      })
    });
    const empData = await empRes.json();
    if (!empData.success) {
      throw new Error(`Employee creation failed: ${JSON.stringify(empData)}`);
    }
    const employeeId = empData.user.id;
    console.log(`Employee created! ID: ${employeeId}`);

    // 6. Update Employee details (Manager)
    console.log('\n6. Updating Jane Doe designation and phone (Manager)...');
    const updateEmpRes = await fetch(`${API_URL}/users/${employeeId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${managerToken}`
      },
      body: JSON.stringify({
        phone: '',
        designation: 'Senior Software Engineer'
      })
    });
    const updateEmpData = await updateEmpRes.json();
    if (!updateEmpData.success) {
      throw new Error(`Manager failed to update employee: ${JSON.stringify(updateEmpData)}`);
    }
    console.log('Employee updated successfully by Manager.');

    // 7. Verify Employee details
    console.log('\n7. Verifying Jane Doe values...');
    const listRes = await fetch(`${API_URL}/users`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${managerToken}`
      }
    });
    const listData = await listRes.json();
    const updatedJane = listData.users.find(u => u._id === employeeId);
    if (!updatedJane) {
      throw new Error('Jane Doe not found in retrieved list');
    }
    console.log(`Jane Doe fields: phone = "${updatedJane.phone}", designation = "${updatedJane.designation}"`);
    if (updatedJane.phone !== '' || updatedJane.designation !== 'Senior Software Engineer') {
      throw new Error('Verification failed: Designation or Phone mismatch!');
    }
    console.log('Verification Success: Manager successfully modified designation and cleared phone!');

    // 8. Create Project (Manager)
    console.log('\n8. Creating project (Manager)...');
    const projRes = await fetch(`${API_URL}/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${managerToken}`
      },
      body: JSON.stringify({
        name: 'Sprint Alpha'
      })
    });
    const projData = await projRes.json();
    if (!projData.success) {
      throw new Error(`Manager project creation failed: ${JSON.stringify(projData)}`);
    }
    const projectId = projData.project._id;
    console.log(`Project created: ID: ${projectId}, Name: ${projData.project.name}`);

    // 9. Create Task (Manager)
    console.log('\n9. Creating task with description (Manager)...');
    const taskRes = await fetch(`${API_URL}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${managerToken}`
      },
      body: JSON.stringify({
        title: 'Task Alpha',
        project: projectId,
        description: 'Original description'
      })
    });
    const taskData = await taskRes.json();
    if (!taskData.success) {
      throw new Error(`Task creation failed: ${JSON.stringify(taskData)}`);
    }
    const taskId = taskData.task._id;
    console.log(`Task created: ID: ${taskId}, description: "${taskData.task.description}"`);

    // 10. Update Task - Clear Description (Manager)
    console.log('\n10. Clearing task description (Manager)...');
    const updateTaskRes = await fetch(`${API_URL}/tasks/${taskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${managerToken}`
      },
      body: JSON.stringify({
        description: ''
      })
    });
    const updateTaskData = await updateTaskRes.json();
    if (!updateTaskData.success) {
      throw new Error(`Task update failed: ${JSON.stringify(updateTaskData)}`);
    }
    console.log('Task updated successfully by Manager.');

    // 11. Retrieve Task & Verify description is empty string
    console.log('\n11. Fetching tasks list to verify description is cleared...');
    const listTasksRes = await fetch(`${API_URL}/tasks`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${managerToken}`
      }
    });
    const listTasksData = await listTasksRes.json();
    const updatedTask = listTasksData.tasks.find(t => t._id === taskId);
    if (!updatedTask) {
      throw new Error('Task not found in retrieved tasks list');
    }
    console.log(`Task description = "${updatedTask.description}"`);
    if (updatedTask.description !== '') {
      throw new Error(`Task description was NOT cleared! Description: ${updatedTask.description}`);
    }
    console.log('Verification Success: Task description is successfully cleared to empty string!');

    // 12. Super Admin capabilities check
    console.log('\n12. Performing Super Admin capability checks...');
    console.log('Logging in as Super Admin...');
    const saLoginRes = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@workarea.com', password: 'admin123' })
    });
    const saLoginData = await saLoginRes.json();
    if (!saLoginData.success) {
      throw new Error(`Super Admin login failed: ${JSON.stringify(saLoginData)}`);
    }
    const superAdminToken = saLoginData.token;
    console.log('Super Admin authenticated successfully.');

    const companyId = regData.user.company._id || regData.user.company.id;

    console.log(`Fetching details for company ${companyId} as Super Admin...`);
    const saGetRes = await fetch(`${API_URL}/companies/${companyId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${superAdminToken}`
      }
    });
    const saGetData = await saGetRes.json();
    if (!saGetData.success) {
      throw new Error(`Super Admin failed to get company details: ${JSON.stringify(saGetData)}`);
    }
    console.log(`Company fetched: ${saGetData.company.name}, current status: ${saGetData.company.status}, plan: ${saGetData.company.subscriptionPlan}`);

    console.log(`Updating company status to 'Suspended' and plan to 'Enterprise' as Super Admin...`);
    const saPutRes = await fetch(`${API_URL}/companies/${companyId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${superAdminToken}`
      },
      body: JSON.stringify({
        status: 'Suspended',
        subscriptionPlan: 'Enterprise'
      })
    });
    const saPutData = await saPutRes.json();
    if (!saPutData.success) {
      throw new Error(`Super Admin failed to update company status/plan: ${JSON.stringify(saPutData)}`);
    }
    console.log('Update response verified: status =', saPutData.company.status, ', plan =', saPutData.company.subscriptionPlan);
    if (saPutData.company.status !== 'Suspended' || saPutData.company.subscriptionPlan !== 'Enterprise') {
      throw new Error('Verification failed: company status or plan did not match updated values!');
    }
    console.log('Verification Success: Super Admin successfully updated company status and plan!');

    console.log('Reverting company status to active for integrity...');
    const saPutRes2 = await fetch(`${API_URL}/companies/${companyId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${superAdminToken}`
      },
      body: JSON.stringify({
        status: 'Active',
        subscriptionPlan: 'Professional'
      })
    });
    const saPutData2 = await saPutRes2.json();
    if (!saPutData2.success || saPutData2.company.status !== 'Active') {
      throw new Error('Failed to revert status to Active');
    }
    console.log('Company status reverted to Active.');

    console.log('Checking platform endpoints (stats, settings, revenue, analytics)...');
    const endpoints = ['stats', 'platform-settings', 'platform-revenue', 'platform-analytics'];
    for (const ep of endpoints) {
      const epRes = await fetch(`${API_URL}/companies/${ep}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${superAdminToken}`
        }
      });
      const epData = await epRes.json();
      if (!epData.success) {
        throw new Error(`Platform API check failed on endpoint /companies/${ep}: ${JSON.stringify(epData)}`);
      }
      console.log(`- GET /companies/${ep} responded successfully.`);
    }
    console.log('Platform API checks verification successful!');

    // 13. Employee attendance logging and status check
    console.log('\n13. Performing Employee attendance logging check...');
    const janeEmail = `jane-${randomSuffix}@doe.com`;
    console.log(`Logging in as Employee Jane Doe (${janeEmail})...`);
    const empLoginRes = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: janeEmail, password: 'Temp@123' })
    });
    const empLoginData = await empLoginRes.json();
    if (!empLoginData.success) {
      throw new Error(`Employee login failed: ${JSON.stringify(empLoginData)}`);
    }
    let employeeToken = empLoginData.token;
    console.log('Logged in! Changing password to resolve forced first-time change...');

    const empChangePwdRes = await fetch(`${API_URL}/auth/change-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${employeeToken}`
      },
      body: JSON.stringify({ currentPassword: 'Temp@123', newPassword: 'Password123' })
    });
    const empChangePwdData = await empChangePwdRes.json();
    if (!empChangePwdData.success) {
      throw new Error(`Employee password change failed: ${JSON.stringify(empChangePwdData)}`);
    }
    console.log('Password updated successfully. Logging in again to fetch fresh session...');

    const empLoginRes2 = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: janeEmail, password: 'Password123' })
    });
    const empLoginData2 = await empLoginRes2.json();
    employeeToken = empLoginData2.token;
    console.log('Employee token acquired successfully.');

    console.log('Checking in as Employee Jane Doe...');
    const checkInRes = await fetch(`${API_URL}/attendance/check-in`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${employeeToken}`
      }
    });
    const checkInData = await checkInRes.json();
    if (!checkInData.success) {
      throw new Error(`Employee check-in failed: ${JSON.stringify(checkInData)}`);
    }
    console.log(`Checked in successfully! Time: ${checkInData.log.checkIn}, Status: ${checkInData.log.status}`);

    console.log('Fetching attendance logs to verify check-in exists...');
    const getLogsRes = await fetch(`${API_URL}/attendance`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${employeeToken}`
      }
    });
    const getLogsData = await getLogsRes.json();
    if (!getLogsData.success) {
      throw new Error(`Failed to fetch logs: ${JSON.stringify(getLogsData)}`);
    }
    const today = new Date().toISOString().split('T')[0];
    const todayLog = getLogsData.logs.find(l => l.date === today);
    if (!todayLog) {
      throw new Error(`Verification failed: attendance log not found for date ${today}!`);
    }
    console.log(`Verification Success: Found attendance log for today with checkIn: ${todayLog.checkIn}`);

    console.log('Checking out as Employee Jane Doe...');
    const checkOutRes = await fetch(`${API_URL}/attendance/check-out`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${employeeToken}`
      }
    });
    const checkOutData = await checkOutRes.json();
    if (!checkOutData.success) {
      throw new Error(`Employee check-out failed: ${JSON.stringify(checkOutData)}`);
    }
    console.log(`Checked out successfully! Time: ${checkOutData.log.checkOut}`);

    console.log('Fetching logs again to verify check-out timestamp...');
    const getLogsRes2 = await fetch(`${API_URL}/attendance`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${employeeToken}`
      }
    });
    const getLogsData2 = await getLogsRes2.json();
    const todayLog2 = getLogsData2.logs.find(l => l.date === today);
    if (!todayLog2 || !todayLog2.checkOut) {
      throw new Error(`Verification failed: check-out time not updated. Log: ${JSON.stringify(todayLog2)}`);
    }
    console.log(`Verification Success: Employee attendance log updated with checkOut: ${todayLog2.checkOut}`);

    console.log('\n--- ALL TESTS COMPLETED SUCCESSFULLY! ALL BUGS RESOLVED! ---');
  } catch (error) {
    console.error('\nTest failed with error:', error.message);
    process.exit(1);
  }
};

runTests();
