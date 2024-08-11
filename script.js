document.addEventListener('DOMContentLoaded', function() {
    // 오늘의 날짜를 YYYYMMDD 형식으로 가져오는 함수
    function getTodayDate() {
        const today = new Date();
        const year = today.getFullYear();
        const month = ('0' + (today.getMonth() + 1)).slice(-2);
        const day = ('0' + today.getDate()).slice(-2);
        return year + month + day;
    }

    // NEIS API URL 설정 (오늘 날짜를 포함)
    const todayDate = getTodayDate();
    const apiUrl = `https://open.neis.go.kr/hub/mealServiceDietInfo?ATPT_OFCDC_SC_CODE=J10&SD_SCHUL_CODE=7531100&MLSV_YMD=${todayDate}&Type=json`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const mealContent = document.getElementById('meal-content');
            if (data.mealServiceDietInfo && data.mealServiceDietInfo[1].row.length > 0) {
                const mealInfo = data.mealServiceDietInfo[1].row[0].DDISH_NM.replace(/<br\/>/g, '\n');
                mealContent.textContent = mealInfo;
                Swal.fire({
                    icon: 'success',
                    title: '급식 정보 로드 성공',
                    text: `오늘(${todayDate})의 급식 정보를 성공적으로 가져왔습니다.`,
                    timer: 1500,
                    showConfirmButton: false
                });
            } else {
                mealContent.textContent = '오늘은 급식 정보가 없습니다.';
                Swal.fire({
                    icon: 'info',
                    title: '급식 정보 없음',
                    text: '오늘 제공된 급식 정보가 없습니다.',
                });
            }
        })
        .catch(error => {
            console.error('Error fetching meal data:', error);
            document.getElementById('meal-content').textContent = '급식 정보를 불러오지 못했습니다.';
            Swal.fire({
                icon: 'error',
                title: '오류 발생',
                text: '급식 정보를 가져오는 중 오류가 발생했습니다.',
            });
        });
});
